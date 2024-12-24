const express = require('express');
const {cqb} = require('../static/data')

const scatter003 = express.Router();

// 构造延迟返回数据的效果
const createPromise = (index, callback) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            callback();
            resolve();
        }, 50 * index);
    })
}

scatter003.get('/', (req, res) => {
    // 流式返回数据
    const data = cqb;
    const chunkData = data.split('。')
        .filter(e => e.trim())
        .map((chunk, index) => {
            chunk = chunk.trim();
            return createPromise(
                index,
                () => res.write(chunk + '。')
            )
        });
    Promise.all(chunkData).then(() => {
        res.end();
    }).catch(err => {
        console.log('err at router/scatter003:', err.message);
        res.write(err.message);
        res.end();
    })
});

// 一次性返回数据
scatter003.get('/once', (req, res) => {
    const data = cqb.repeat(10).trim();
    res.json({data});
})

exports.scatter003 = scatter003;
