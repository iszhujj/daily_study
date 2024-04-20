const multer = require('multer');
const fs = require('fs')
const path = require('path')

// 配置存储规则。destination 值为文件存储的路径， filename为存储时的文件名
// 单文件； 从 req.headers['file-name'] 中获取文件名
const init_storage = (destination, custom_file_name) => multer.diskStorage({
    destination: destination,
    filename:(req, file, callback)=>{
        if(custom_file_name){
            // 如果是分片上传，则用 hash 值作为文件名
            return callback(null, custom_file_name)
        }else{
            // res.headers 中的所有键都会变成小写
            // file 中的 originalname 是原文件名，但是中文会显示成乱码
            const source_name = decodeURIComponent(req.headers['file-name'])
            const FileName = source_name.includes('.') ? source_name.split('.')[0] : source_name
            const fileType = source_name.includes('.') ? source_name.split('.')[1] : ''
            const random_num = Math.ceil(1 + Math.random() * 1000)
            const file_name = `${FileName}_${Date.now()}_${random_num}.${fileType}`
            return callback(null, file_name)
        }
    }
})

// 多文件；从 file.fieldname 中获取文件名，field 就是 formdata 中的键
const m_init_storage = (destination, custom_file_name) => multer.diskStorage({
    destination: destination,
    filename:(req, file, callback)=>{
        if(custom_file_name){
            // 如果是分片上传，则用 hash 值作为文件名
            return callback(null, custom_file_name)
        }else{
            // file 中的 fieldname 就是 formdata 中的键名
            const source_name = decodeURIComponent(file.fieldname)
            const FileName = source_name.includes('.') ? source_name.split('.')[0] : source_name
            const fileType = source_name.includes('.') ? source_name.split('.')[1] : ''
            const random_num = Math.ceil(1 + Math.random() * 1000)
            const file_name = `${FileName}_${Date.now()}_${random_num}.${fileType}`
            return callback(null, file_name)
        }
    }
})

// 多文件时的过滤规则
const m_filterRule = (req, file, callback)=>{
    console.log(file)
    callback(null, true)
}

// 合并分片形成最终的文件
const combine_chunk_to_file = async (DIR, fileName, res)=>{
    // 合并完成后的文件名
    const end_filePath = `./fileFromSlice/${fileName}`
    // 读取目录下的所有文件的文件名
    const chunkPaths = fs.readdirSync(DIR);

    // 读取临时文件夹获得的文件（分片）名称数组可能乱序，需要重新排序
    chunkPaths.sort((a, b) => a.split("-")[1] - b.split("-")[1]);

    // 遍历文件（分片）数组，将分片追加到文件中
    const pool = chunkPaths.map((chunkName) =>
        new Promise((resolve) => {
            const abs_path_of_chunk = path.resolve(DIR, chunkName);
            // 将分片追加到文件中
            fs.appendFileSync(end_filePath, fs.readFileSync(abs_path_of_chunk));
            // 删除分片
            fs.unlinkSync(abs_path_of_chunk);
            resolve();
        })
    );

    Promise.all(pool).then(result =>{
        // 等待所有分片追加到文件后，删除临时文件夹
        fs.rmdirSync(DIR);
        res.json({
            success: true,
            msg: "合并成功",
        });
    }).catch(err =>{
        console.log(err)
        res.json({result:false, msg:'合并文件错误'})
    })
}

module.exports = {
    init_storage,
    combine_chunk_to_file,
    m_init_storage,
    m_filterRule
}