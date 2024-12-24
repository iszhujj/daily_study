/**
 * promise.allSettle 等待所有的任务都完成，而不关心其resolve还是reject
 * 只要所有的任务都完成了，结果就会返回resolve,
 * 结果会是一个数组，对应的是每个任务的执行状态
 */
Promise.myAllSettled = (arr) => {
    let resolve;
    const p = new Promise(res => { resolve = res; });
    let count = 0;
    const resArr = [];
    for (let task of arr) {
        const tmpIndex = count;
        Promise.resolve(task).then(res => {
            resArr[tmpIndex] = res;
        }).catch(err => {
            resArr[tmpIndex] = err;
        }).finally(() => {
            count--;
            if (count === 0) {
                resolve(resArr);
            };
        })
        count++;
    };
    if (count === 0) {
        return resolve([]);
    }
    return p;
};

const testPromiseMyAllSettled = () => {
    return Promise.myAllSettled([
        Promise.resolve(1),
        Promise.reject(new Error('test error')),
        Promise.resolve(3),
    ]).then(results => {
        console.log(results); // [1, Error: test error, 3]
    });
};

testPromiseMyAllSettled();
