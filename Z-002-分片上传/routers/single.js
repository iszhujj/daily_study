const express = require('express');
const multer = require('multer');
const fs = require('fs')
const {init_storage, combine_chunk_to_file} = require('../util/config')

const uploadSingleFileRouter = express.Router();

// 检查请求头是否携带File-Name
uploadSingleFileRouter.use((req, res, next)=>{
    if(!req.headers['file-name']) res.json({result:'缺少请求头.1'});
    else next();
})

// 分片上传时需要检查是否有分片标识以及完成标志
uploadSingleFileRouter.use((req, res, next)=>{
    if(req.path.includes('slice')){
        if(!req.headers['finish-upload'] || !req.headers['file-hash-flag']) 
            res.json({result:'分片上传缺少请求头.2'});
        else next();
    }else{
        next()
    }
})

// 检查是否存在分片，存在分片即说明文件已经分片上传过，但是并未上传和合并完成
uploadSingleFileRouter.get('/check-file-hash', (req, res)=>{
    let fileHash = req.headers['file-hash-flag'];
    let tempChunkFiles = fs.readdirSync('./tempChunk');
    // 存在该分片的临时目录
    if(tempChunkFiles.includes(fileHash)){
        let chunks = fs.readdirSync(`./tempChunk/${fileHash}`);
        // exp 表示期望的下一个分片是第几段
        res.json({result:true, exp:chunks.length})
    }else{
        res.json({result:false})
    }
})

// 分片上传
uploadSingleFileRouter.post('/slice', (req, res)=>{
    // 用于判断是否分片上传完毕，如果上传完毕那么就需要合并文件
    const finishUpload = req.headers['finish-upload'];
    // 分片标识，由 hash值-片序 构成
    const fileHashFlag = req.headers['file-hash-flag'];

    const random_num = Math.ceil(1 + Math.random() * 1000)
    const fileName = decodeURIComponent(req.headers['file-name']);
    const outputName = `${Date.now()}_${random_num}_${fileName}`;
    const DIR = `./tempChunk/${fileHashFlag.split('-')[0]}`;

    const storage = init_storage(DIR, fileHashFlag);
    const upload = multer({storage: storage}).single('chunk')
    upload(req, res, (err)=>{
        if(err) res.send({result:false});
        else{
            if(finishUpload === 'true') combine_chunk_to_file(DIR, outputName, res);
            else res.json({
                filename: req.body.filename,
                result: true
            })
        }
    })
})

// 上传单一文件，一次性完成上传
uploadSingleFileRouter.post('/upload-directly', (req, res)=>{
    const storage = init_storage('./tempFile')
    const upload = multer({storage: storage}).single('file')
    upload(req, res, (err)=>{
        if(err) res.send({result:false});
        else res.json({
            filename: req.body.filename,
            result: true
        })
    })
})

exports.uploadSingleFileRouter = uploadSingleFileRouter;