const express = require('express');

const app = express();
const {uploadSingleFileRouter} = require('./routers/single.js')
const {uploadMultipleFileRouter} = require('./routers/multiple.js')

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use((req, res, next)=>{
    // 解决跨域
    res.setHeader('Access-Control-Allow-Origin', '*');
    // 运行通过的请求头
    res.setHeader('Access-Control-Allow-Headers', `File-Name,Finish-upload,File-Hash-Flag`)
    next();
})

// 处理单文件上传
app.use('/single', uploadSingleFileRouter);

// 处理多文件上传
app.use('/multiple', uploadMultipleFileRouter);

app.use((err, req, res)=>{
    res.status(500)
})

app.listen(3000, ()=>{
    console.log('3000 listening')
})