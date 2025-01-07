/* eslint-disable */
const data = [
    {
        str1: 'abcdefg',
        str2: 'ab1cdefgabc1defg',
        expect: 'cdefg'
    },
    {
        str1: '1AB2345CD',
        str2: '12345EFG',
        expect: '2345'
    }
];

const LCS = (str1, str2) => {
    // 记录从前面到当前位置（包含当前位置元素）的最长公共子串的长度
    let sizeArr = new Array(str1.length).fill(0);
    // 最长公共子串的结束位置
    let maxEndIndex = 0;

    // 随便遍历一个字符串
    for(let i = 0 ; i < str1.length ; i ++) {
        // 第一个元素，判断其是否存在于第二个字符串中，如果存在则长度为1
        if(i === 0) {
            sizeArr[i] = str2.includes(str1[i]) ? 1 : 0;
        }
        else {
            // maxStr： 前一个元素的最长公共子串 + 当前元素
            let maxStr = str1.slice(i - sizeArr[i - 1], i + 1);
            // maxStr 存在于第二个字符串中，则最长公共子串长度 + 1
            if(str2.includes(maxStr)) {
                sizeArr[i] = sizeArr[i - 1] + 1;
                maxEndIndex = sizeArr[i] > sizeArr[maxEndIndex] ? i : maxEndIndex;
            }
            else {
                // 不断去掉最前面的元素，判断剩余字符串是否存在于第二个字符串中
                maxStr = maxStr.length > 1 ? maxStr.slice(1) : maxStr;
                while(maxStr.length > 1) {
                    if(str2.includes(maxStr)) {
                        sizeArr[i] = maxStr.length;
                        break;
                    }
                    maxStr = maxStr.slice(1);
                }
                // 最后只剩下当前元素了
                if(maxStr.length === 1) {
                    sizeArr[i] = str2.includes(str1[i]) ? 1 : 0;
                }
            }
        }
    }
    return str1.slice(maxEndIndex - sizeArr[maxEndIndex] + 1, maxEndIndex + 1);
};

const {str1, str2, expect} = data[0];
const res = LCS(str1, str2);
console.log(res, res === expect);