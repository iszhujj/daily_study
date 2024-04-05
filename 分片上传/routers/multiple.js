const express = require('express');
const multer = require('multer')
const {
    m_init_storage, 
    combine_chunk_to_file, 
    m_filterRule
} = require('../util/config')

const uploadMultipleFileRouter = express.Router();

// 直接上传多个文件
uploadMultipleFileRouter.post('/multiple-directly', (req, res)=>{
    const storage = m_init_storage('./tempFile');
    // 接受任意多个文件
    const upload = multer({
        storage: storage,
        limits:{
            fieldSize: 1024 * 20        // 单文件的最大大小为 20M
        },
        fileFilter:(req, file, cb)=>{
            // 接受的文件类型；多文件上传时，只会下载满足规则的类型
            // 不满足规则的文件不会被下载，不会报错
            let mimetypes = ['image', 'video', 'audio', 'zip']
            let fileType = file.mimetype.toLowerCase();
            if(mimetypes.some(e => fileType.includes(e))) cb(null, true);
            else cb(null, false);
        }
    }).any();
    upload(req, res, (err)=>{
        if(err) res.send({result:false});
        else res.json({
            filename: req.body.filename,
            result: true
        })
    })
})

exports.uploadMultipleFileRouter = uploadMultipleFileRouter;

