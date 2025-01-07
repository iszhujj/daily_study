/**
 *                      1
 *                    /   \
 *                   2     7
 *                  / \   / \
 *                 3   5  8  11
 *                /     \  \   \
 *               4       6  9   12
 *                           \
 *                           10
 */
/* eslint-disable */
const tree = {
    value: 1,
    left: {
        value: 2,
        left: {
            value: 3,
            left: {
                value: 4,
                left: null,
                right: null,
            },
            right: null,
        },
        right: {
            value: 5,
            left: null,
            right: {
                value: 6,
                left: null,
                right: null,
            },
        },
    },
    right: {
        value: 7,
        left: {
            value: 8,
            left: null,
            right: {
                value: 9,
                left: null,
                right: {
                    value: 10,
                    left: null,
                    right: null,
                },
            },
        },
        right: {
            value: 11,
            left: null,
            right: {
                value: 12,
                left: null,
                right: null,
            },
        },
    },
};

const visit = (root, type) => {
    // pre: 前序遍历; mid: 中序遍历; end: 后序遍历
    const typeList = ['pre', 'mid', 'end'];
    if(!typeList.includes(type)) {
        return 'type error';
    }
    let res = [];
    (function fn(root) {
        type === 'pre' && res.push(root.value);
        if(root.left) {
            fn(root.left);
        }
        type === 'mid' && res.push(root.value);
        if(root.right) {
            fn(root.right);
        }
        type === 'end' && res.push(root.value);
    })(root);
    return res;
}

console.log(visit(tree, 'end'));

