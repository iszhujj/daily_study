import { reactive } from "./index.js";

// 如何识别一个对象是不是 Proxy 实例
function testTagProxy() {
    //通过 Proxy 对 Proxy 本身做代理，然后赋值给 Proxy
    Proxy = new Proxy(Proxy, {
        //拦截 new 操作符，生成 Proxy 实例的时候来拦截
        construct: function (target, argumentsList) {
        //result是new Proxy()生成的原本的实例
        const result = new target(...argumentsList);
        //获取原本实例result的类型
        const originToStringTag = Object.prototype.toString.call(result).slice(1,-1).split(' ')[1]
        //改写result的[Symbol.toStringTag]属性，加上被代理的标志
        result[Symbol.toStringTag] = 'Proxy-' + originToStringTag;
        return result;
        },
    });
    
    const p = new Proxy({}, {});
    console.log(p.toString());
}

function test1() {
    const obj = {
        a: 1,
        b: 2,
        get c() {
            // 默认的 this 是 obj
            // 读取c时，理应要对a、b、c进行依赖收集
            // 因此要改变this指向，将this指向代理对象
            return this.a + this.b;
        }
    };
    const proxy_obj = reactive(obj);
    const fn = () => {
        proxy_obj.c;
    }
    fn();
};

// 依赖的深度收集
function test2() {
    const obj = {
        a: 1,
        b: 2,
        c: {
            d: 3
        }
    };
    const proxy_obj = reactive(obj);
    const fn = () => {
        // 深度代理
        proxy_obj.c.d;
    }
    fn();
};

// in 关键字读取时的收集
function test3() {
    const obj = {
        a: 1,
        b: 2,
        c: 3
    };
    const proxy_obj = reactive(obj);
    const fn = () => {
        console.log('a' in proxy_obj);
    }
    fn();
}

// for-in 读取时的收集
function test4() {
    const obj = {
        a: 1,
        b: 2,
        c: 3
    };
    const proxy_obj = reactive(obj);
    const fn = () => {
        for(let key in proxy_obj) {
            console.log(key);
        }
    }
    fn();
}

// 删除属性
function test5() {
    const obj = {
        a: 1,
        b: 2,
        c: 3
    };
    const proxy_obj = reactive(obj);
    const fn = () => {
        'a' in proxy_obj;
    }
    fn();
    delete proxy_obj.d;
}

// 修改属性
function test6() {
    const obj = {
        a: 1,
        b: 2,
        c: NaN
    };
    const proxy_obj = reactive(obj);
    const fn = () => {
        'c' in proxy_obj;
    }
    fn();
    proxy_obj.c = NaN;
}

// 新增属性
function test7() {
    const obj = {
        a: 1,
        b: 2,
    };
    const proxy_obj = reactive(obj);
    const fn = () => {
        'c' in proxy_obj;
    }
    fn();
    proxy_obj.c = 4;
}

// 数组的代理
function test8() {
    const arr = [1, 2, 3];
    const proxy_arr = reactive(arr);
    const fn = () => {
        proxy_arr.indexOf(2);
    };
    fn();
    /**
     * 对于 indexOf 会依次进行以下的几次依赖收集
     * 1. get indexOf       读取数组的indexOf方法
     * 2. get length        读取数组的length属性
     * 3. has 0             判断数组中是否有0 （键）
     * 4. get 0             如果有0 （）键，则读取第一个元素
     * 5. has 1
     * 6. get 1
     */
}

// 数组中如果有一个对象
function test9() {
    const obj = {a: 1}
    const arr = [1, obj, 3];
    const proxy_arr = reactive(arr);
    const fn = () => {
        // 两者并不是相同的，一个是代理对象，一个是普通对象
        console.log(proxy_arr[1], arr[1]);

        const res = proxy_arr.includes(obj);
        console.log('查询结果：', res);
    };
    fn();
    /**
     * 对于 includes 会依次进行以下的几次依赖收集:
     * 1. get includes
     * 2. get length
     * 3. get 0
     * 4. get 1
     * 在依赖收集的时候，如果收集到的依赖是一个对象，那么会将该对象进行深度的代理
     */
}

// 对数组的写
function test10() {
    const arr = [1, 2, 3];
    const proxy_arr = reactive(arr);
    const fn = () => {
        proxy_arr.push(4);
    };
    fn();
    /**
     * 1. get push
     * 2. get length
     * 3. add 
     */

    const fn2 = () => {
        proxy_arr[0] = 0;
    }
    fn2();
    /**
     * 1. set
     */
}

// 对稀疏数组的写
function test11() {
    const arr = [, 2, 3];
    const proxy_arr = reactive(arr);
    const fn = () => {
        proxy_arr[0] = 1;
    };
    fn();
    /**
     * 1. add           // 是add，而不是set
     */
}

// 对数组进行写操作后，改变了数组的长度
function test12() {
    const arr = [1, 2, 3];
    const proxy_arr = reactive(arr);
    const fn = () => {
        proxy_arr[6] = 4;
    };
    fn();
    /**
     * 1. add 6
     * 2. set length
     */
}

// 如果使用Object.defineProperty()方法修改属性，那么不会触发派发更新
function test13() {
    // 数组和对象都不会引起派发更新
    const obj = {
        a: 1,
        b: 2,
        c: 3
    };
    const proxy_obj = reactive(obj);
    const fn = () => {
        Object.defineProperty(proxy_obj, 'c', {
            value: 4
        });
    };
    fn();
    console.log(proxy_obj['c']);       // 4 这里读取proxy_obj['c']会触发依赖收集

    const arr = [1, 2, 3];
    const proxy_arr = reactive(arr);
    const fn2 = () => {
        Object.defineProperty(proxy_arr, '0', {
            value: 0
        });
    };
    fn2();
    console.log(proxy_arr[0]);          // 0 这里读取proxy_arr[0]不触发依赖收集？？？
}

// 数组的直接读取
function test14() {
    const arr = [1, 2, 3];
    const proxy_arr = reactive(arr);
    const fn = () => {
        console.log(proxy_arr[0]);
    };
    fn();
}

// 如果直接修改length属性，将length减小，需要触发delete的派发更新
function test15() {
    const arr = [1, 2, 3, 4, 5, 6];
    const proxy_arr = reactive(arr);
    const fn = () => {
        proxy_arr.length = 2;
    };
    fn();
    console.log(proxy_arr.length, proxy_arr);
}

// 调用修改数组的方法
function test16() {
    const arr = [1, 2, 3];
    const proxy_arr = reactive(arr);
    const fn = () => {
        proxy_arr.push(4);
    };
    fn();
    /**
     * 调用push方法时，push会进行一次依赖收集
     * length也会进行一次依赖收集
     * 但是这里的length并不是用户所需要的依赖，不需要去收集他
     * 因此调用类似的这些方法时，可以暂停依赖的收集
     */
}

function test17() {
    const arr = [5, 1, 2, 0, 3];
    const proxy_arr = reactive(arr);
    const fn = () => {
        proxy_arr.reverse();
        console.log(proxy_arr);
    };
    fn();
}

test17();





