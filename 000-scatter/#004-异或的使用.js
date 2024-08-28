/**
 * 异或：相同为0，相异为1.
 * 适用情况：在一个数组中，除了某一个数只出现一次外，其余的数均出现偶数次，找出该数
 * 满足交换律： a ^ b ^ c ^ a ^ c ^ b = a ^ a ^ b ^ b ^ c ^ c = 0
 */
const arr = [1, 2, 3, 4, 5, 4, 1, 3, 2];        // 5 只出现一次

const fn = (arr) => {
    return arr.reduce(
        (pre, cur) => {
            return pre ^ cur;
        }
    )
}

const res = fn(arr);
console.log(res);
