/**
 * promise.all 等待所有的promise完成，并关注其resolve或reject
 * 只有所有的任务都resolve，结果才会返回resolve，只要有一个是reject，就会返回reject
 */

// arr 是一个可迭代对象
Promise.myAll = (arr) => {
    let res;
    let rej;
    const result = new Promise((resolve, reject) => {
        res = resolve;
        rej = reject;
    });
    // 记录 arr 的长度，即要处理多少个“promise”
    let count = 0;
    // 按顺序保存处理后的结果
    let resArr = [];
    for (let item of arr) {
        // 记录当前的下标，用于按顺序保存结果
        let tmpIndex = count;
        // 将同步任务也用promise包装，包装完成后同步的任务还是同步的，异步的还是异步的
        Promise.resolve(item).then(data => {
            resArr[tmpIndex] = data;
            // 处理完一个 promise，计数器减一;走到then的时候，同步任务都完成了，count一定是最大值
            count -= 1;
            // 如果全部任务都处理成功，那么就返回resolve
            if (count === 0) {
                res(resArr);
            }
        }, rej);
        count += 1;
    }
    // 传递的可迭代对象为空
    if (count === 0) {
        res([]);
    }
    return result;
};

Promise.myAll([
    console.log(565),
    1,
    2,
    new Promise((res, rej) => {
        setTimeout(() => {
            res(3);
        }, 1000)
    })
]).then(data => {
    console.log('data:', data);
}).catch(err => {
    console.log('err:', err);
})