/**
 * 深拷贝
 */

const deepClone = (target, map = new Map()) => {
    // 处理原始数据类型
    if(target === null || typeof target !== 'object') return target;
    // 处理日期和正则对象
    if(target instanceof Date) return new Date(target);
    if(target instanceof RegExp) return new RegExp(target);

    // 解决循环引用
    if(map.has(target)) return map.get(target);

    // 保证原型链是一致的
    const clone = Object.create(Object.getPrototypeOf(target), Object.getOwnPropertyDescriptors(target));
    map.set(target, clone);

    // 遍历每一个属性，包括可遍历、不可遍历、Symbol属性
    const keys = Object.getOwnPropertyNames(target);
    const syms = Object.getOwnPropertySymbols(target);
    [...keys, ...syms].forEach(key => {
        // 递归拷贝每一个属性值
        clone[key] = deepClone(target[key], map);
    });

    // 返回拷贝出来的结果
    return clone;
}
