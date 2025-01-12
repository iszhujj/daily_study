export const isObject = val => {
    return val !== null && typeof val === 'object';
};

export const equals = (a, b) => {
    // Object.is 与 === 类似
    // 但 === 将 +0 和 -0 视为相等，将 NaN 与 NaN 视为不相等
    // 而 Object.is 将 +0 和 -0 视为不相等，将 NaN、NaN 视为相等
    // 因此 Object.is 更加适合判断是否有发生变化
    return Object.is(a, b);
}

export const operationType = {
    GET: 'get',
    SET: 'set',
    HAS: 'has',
    DELETE: 'delete',
    ADD: 'add',
    ITERATE: 'iterate',
};