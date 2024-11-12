const fn = (val = null) => {
    var sum = 0;            // 记录初始值
    function fn_inner(val_ = null) {
        if(typeof val_ === 'number') {
            sum += val_;
            return fn_inner;
        }
        else {
            return sum;
        }
    }
    return fn_inner(val);
}

const res = fn(1)(2)(4)(7)();           // 14
console.log(res);

