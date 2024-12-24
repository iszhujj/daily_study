const obj = {
    name: 'zhangsan',
    age: 16,
    gender: 'man',
};

obj[Symbol.iterator] = function () {
    const keys = Object.keys(this);
    let index = 0;
    return {
        next: () => {
            if (index < keys.length) {
                const ret = {
                    value: this[keys[index]],
                    done: false,
                };
                index += 1;
                return ret;
            }
            else {
                return {
                    value: undefined,
                    done: true,
                };
            }
        }
    }
};

let generator = obj[Symbol.iterator]();
let { value, done } = generator.next();
while (!done) {
    console.log(value);
    ({ value, done } = generator.next());
};
// zhangsan 16 man

const res = [...obj];
console.log(res);           // ['zhangsan', 16, 'man']
