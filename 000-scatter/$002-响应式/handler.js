import { operationType } from './util.js';
import { track, trigger, pauseTracking, resumeTracking } from './effect.js';
import { isObject, equals } from './util.js';
import { reactive } from './index.js';

// 用于判断是否要获取原始对象
const ROW = Symbol();

// 重写数组中的几个会触发依赖收集的方法
const arrayMethods = {};
// 重写数组中的几个查找方法，防止在代理对象上因为进行了深层代理而查找不到
['indexOf', 'lastIndexOf', 'includes'].forEach(method => {
    arrayMethods[method] = function(...args) {
        // 这里的 this 是代理对象
        const result = Array.prototype[method].apply(this, args);
        // 如果在代理对象上找不到，那么就去原对象上找
        // 通过读取一个特殊的 Symbol 属性，来判断是否要获取原始对象
        return (result === -1 || result === false)
            ? Array.prototype[method].apply(this[ROW], args)
            : result;
    }
});
// 重写数组中会触发多余的依赖收集的方法
['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(method => {
    arrayMethods[method] = function(...args) {
        // 暂停依赖收集
        pauseTracking();
        // 调用原始方法
        const result = Array.prototype[method].apply(this, args);
        // 恢复依赖收集
        resumeTracking();
        return result;
    }
})

// 供给 proxy 使用
export const handler = {
    // 读取; 目标对象，要读取的键，代理对象
    get: (target, key, receiver) => {
        // 获取到原始对象的方法；通过读取一个特殊的 Symbol 属性，来判断是否要获取原始对象
        if(key === ROW) {
            return target;
        }
        // Reflect.get的第三个参数用于修改this指向，将this改成代理对象，而不是默认的原对象
        const result = Reflect.get(target, key, receiver);
        result && track(target, key, operationType.GET);
        // 如果是数组，并且是会触发依赖收集的几个方法，则返回重写的方法
        if(Array.isArray(target) && arrayMethods.hasOwnProperty(key)) {
            return arrayMethods[key];
        }
        // 如果是对象，则进行深度代理
        return isObject(result) ? reactive(result) : result;
    },
    // 更新或新增属性时的拦截
    set: (target, key, value, receiver) => {
        // 操作的对象是否为数组
        const targetIsArray = Array.isArray(target);
        // 是否是对数组的长度进行修改
        const targetToChangeLength = targetIsArray && key === 'length';
        // 判断是更新还是新增
        const type = target.hasOwnProperty(key) 
            ? operationType.SET 
            : operationType.ADD;
        // 获取旧值
        const oldVal = target[key] || null;
        // 如果是对数组进行操作，获取操作前数组的长度
        const oldLength = targetIsArray && target.length;

        const result = Reflect.set(target, key, value, receiver);
        // 在依赖有变化时，并且设置成功时，才派发更新
        if((!equals(oldVal, value) || type === operationType.ADD) && result) {
            trigger(target, key, type);
            // 如果当修改的是数组，并且修改后length发生了改变
            if(targetIsArray && (oldLength !== target.length)) {
                // 如果修改的并不是length属性，但是引起的 length 属性的变化，手动派发更新
                if(!targetToChangeLength) {
                    trigger(target, 'length', operationType.SET);
                }
                // 如果修改的就是length属性，length属性变小时，派发删除操作
                else {
                    for(let i = target.length; i < oldLength; i++) {
                        trigger(target, i, operationType.DELETE);
                    }
                }
            }
        }
        return result;
    },
    // in关键字判断对象中的属性是否存在时，调用的是内部的 [[hasProperty]] 方法
    // 在 proxy 中，对应的是 has 拦截器
    has: (target, key) => {
        track(target, key, operationType.HAS);
        return Reflect.has(target, key);
    },
    // 在使用for-in循环来遍历对象的键时，调用的是内部的 [[OwnPropertyKeys]] 方法
    // 在 proxy 中，对应的是 ownKeys 拦截器
    ownKeys: (target) => {
        track(target, '', operationType.ITERATE);
        return Reflect.ownKeys(target);
    },
    // 删除属性时的拦截
    deleteProperty: (target, key) => {
        const res = Reflect.deleteProperty(target, key);
        // 删除成功时，才派发更新
        target.hasOwnProperty(key) && res && trigger(target, key, operationType.DELETE);
        return res;
    }
}