const express = require('express');
const app = express();

const { scatter003 } = require('./router/scatter-003');
const { commonRouter } = require('./router/common');
const { jsonpRouter } = require('./router/jsonp');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Expose-Headers', '*');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 专用性测试接口
app.use('/scatter-003', scatter003);
// 通用测试接口
app.use('/common', commonRouter);
// jsonp 测试接口
app.use('/jsonp', jsonpRouter);

app.use((req, res) => {
    res.status(404).send('--- Not Found ---');
})

app.listen(3001, () => {
    console.log('3001 is listening...');
});
