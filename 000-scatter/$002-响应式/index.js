import { isObject } from './util.js';
import { handler } from './handler.js';

// 存储已代理的对象
const targetMap = new WeakMap();

// 通过 Proxy 对 Proxy 本身做代理，然后赋值回 Proxy
// https://juejin.cn/post/6865910564817010702#heading-1
const myProxy = new Proxy(Proxy, {
    // 拦截 new 操作符，生成 Proxy 实例的时候来拦截
    construct: function (target, argumentsList, newTarget) {
        /**
         * target: 构造函数, 这里就是 proxy，因为是对 proxy 的构造函数的拦截
         * argumentsList: 传给构造函数的参数数组，这里就是 proxy 的参数
         * newTarget: new 操作符的目标对象，在这里就是 myProxy
         */
        // console.log(target, argumentsList, newTarget);

        // 获取要被代理的对象，获取其原本的类型
        const sourceObj = argumentsList[0];
        const originToStringTag = Object.prototype.toString.call(sourceObj).slice(1, -1).split(' ')[1]

        // 改写原对象的[Symbol.toStringTag]属性，加上被代理的标志
        // 在使用new target前进行改写，防止触发不必要的派发更新
        const setRes = Reflect.set(argumentsList[0], 'Symbol.toStringTag', 'Proxy-' + originToStringTag);
        // 不可被写及遍历
        setRes && Reflect.defineProperty(argumentsList[0], 'Symbol.toStringTag', {
            writable: false,
            enumerable: false
        })

        // new target() 就相当于 new Proxy()
        const result = new target(...argumentsList);

        return result;
    },
});

export const reactive = (target) => {
    // 如果不是对象，直接返回
    if(!isObject(target)) {
        return target;
    }
    // 如果是proxy，直接返回
    if(target.toString().includes('Proxy')) {
        return target;
    }
    // 如果已经代理过，直接返回
    if(targetMap.has(target)) {
        return targetMap.get(target);
    }
    // 返回一个新的代理对象
    const proxy = new myProxy(target, handler);
    targetMap.set(target, proxy);
    return proxy;
}

