const str1 = '6';
const str2 = '456';

const fn = (str1, str2) => {
    const minLen = Math.min(str1.length, str2.length);
    let ret = 0;
    for (let i = -1; i >= -minLen; i --) {
        const s1 = str1.at(i);
        const s2 = str2.at(i);
        ret += (+s1 + +s2) * Math.pow(10, -i - 1);
    }
    const head = +(
        str1.length > str2.length ? str1 : str2
    ).slice(0, -minLen) * Math.pow(10, minLen);
    ret += head;
    return ret;
}

console.log(fn(str1, str2));