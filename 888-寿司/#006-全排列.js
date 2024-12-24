/**
 * 2024-12-24  
 */

const permute = (str) => {
    // 将字符串转换为数组，便于操作
    const strArr = str.split('');

    // 存储结果的数组
    const result = [];

    // curArr 表示当前排列，residueArr 表示剩余的字符
    // 在内部进行递归，每次从剩余的字符中取一个
    const distribute = (curArr, residueArr) => {
        // 如果已经没有剩余字符，则将该排列加入数组中
        if (residueArr.length === 0) {
            result.push(curArr.join(''));
            return;
        }
        // 遍历剩余的字符数组，
        residueArr.forEach((item, index, arr) => {
            distribute(curArr.concat(item), arr.toSpliced(index, 1));
        });
    }
    distribute([], strArr);
    return result;
};


