const express = require('express');
const fs = require('fs')
const path = require('path')
require('./config/mongo_config')
const videoModel = require('./model/videos_model')

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    next()
})

// 将/MP4设置为静态资源目录；访问测试 http://localhost:3000/MP4/xiaoli_5s_dashinit.mp4
app.use('/MP4', express.static(path.join(__dirname, 'MP4')))

// 获取所有视频列表
app.get('/get-all-video', (req, res)=>{
    videoModel.find({},{videoName:1, _id:0}).then(data =>{
        res.json({
            result:true,
            data:data
        })
    }).catch(err=>{
        console.log(err);
        res.json();
    })
})

// 获取视频的分段列表
app.get('/get-video-info/:videoName', (req, res)=>{
    let videoName = req.params.videoName;
    if(!videoName){
        res.json({result:false, msg:'缺少参数'})
    }else{
        videoModel.findOne({videoName: videoName}).then(data =>{
            if(data){
                res.json({
                    result:true, 
                    videoName:data.videoName, 
                    segments:data.segments,
                    mimeType:data.mimeType
                })
            }else{
                res.json({result:false, msg:'没有数据'})                
            }
        }).catch(err => {
            console.log(err)
            res.json({})
        })
    }
})

// fs.readFile('./MP4/一路向北_dash.mpd', 'utf-8', (err, data)=>{
//     if(err){
//         console.log('读取错误');
//     }else{
//         var re_ = /<SegmentURL .*>/g
//         let res = [...data.matchAll(re_)]
//             .map((e, i) => {
//                 let arr = e[0].split('="')[1].split('"')[0].split('-')
//                 return {start: i === 0 ? 0 : parseInt(arr[0]), end: parseInt(arr[1])}
//             })
//         console.log(res)
//         videoModel.create({
//             videoName:'xiaoli_5s.mp4',
//             segments:res
//         }).then((res, rej) =>{
//             console.log(res)
//         })
//         console.log('ok')
//     }
// })

app.use((req, res)=>{ res.status(404) })

app.listen(3000, ()=>{console.log('3000 listening')})