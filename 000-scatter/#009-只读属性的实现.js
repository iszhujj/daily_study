// 第一种方式
// let obj = {};
// Object.defineProperty(obj, 'name', {
//     value: 'zhangsan',
//     writable: false,
// });
// console.log(obj.name); // zhangsan
// obj.name = 'lisi';
// console.log(obj.name); // zhangsan

// 第二种方式
// let obj1 = {};
// Object.defineProperty(obj1, 'name', {
//     get() {
//         return 'zhangsan';
//     },
//     // 没有set方法，所以name属性是只读的
// });
// console.log(obj1.name); // zhangsan
// obj1.name = 'lisi';
// console.log(obj1.name); // zhangsan


// 使用 proxy
// let obj2 = {
//     name: 'zhangsan',
//     age: 15
// };
// let proxy = new Proxy(obj2, {
//     get(target, key) {
//         return target[key] + '#';
//     },
//     set(target, property, value) {
//         return false;
//     }
// });
// console.log(proxy.name);            // zhangsan#
// proxy.name = 'lisi';
// console.log(proxy.name);            // zhangsan#


// Object.freeze()  将整个对象都冻结，整个都不能修改了
let obj4 = {
    name: 'zhangsan',
    age: 15
};
console.log(obj4.name);
Object.freeze(obj4);
obj4.name = 'lisi';
console.log(obj4.name);
