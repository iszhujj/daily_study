const arr = [
    'abc',
    '123',
    '123abc',
    '123abc123',
    '123.123',
    '123.123abc',
]

arr.forEach((item) => {
    console.log('Number: ', item, '-->', Number(item));
    console.log('parseInt: ', item, '-->', parseInt(item));
    console.log('parseFloat: ', item, '-->', parseFloat(item));
    console.log('+', item, '-->', +item);
    console.log('-------------------------');
})

/**
 * 结果：
    Number:  abc --> NaN
    parseInt:  abc --> NaN
    parseFloat:  abc --> NaN
    + abc --> NaN
    -------------------------
    Number:  123 --> 123
    parseInt:  123 --> 123
    parseFloat:  123 --> 123
    + 123 --> 123
    -------------------------
    Number:  123abc --> NaN
    parseInt:  123abc --> 123
    parseFloat:  123abc --> 123
    + 123abc --> NaN
    -------------------------
    Number:  123abc123 --> NaN
    parseInt:  123abc123 --> 123
    parseFloat:  123abc123 --> 123
    + 123abc123 --> NaN
    -------------------------
    Number:  123.123 --> 123.123
    parseInt:  123.123 --> 123
    parseFloat:  123.123 --> 123.123
    + 123.123 --> 123.123
    -------------------------
    Number:  123.123abc --> NaN
    parseInt:  123.123abc --> 123
    parseFloat:  123.123abc --> 123.123
    + 123.123abc --> NaN
 */