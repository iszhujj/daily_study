const {exec} = require('child_process')
const path = require('path')
const fs = require('fs')


let videoName = '一路向北.mp4'
let videoDashName = videoName.split('.').join('_dashinit.')
let videoDashMpd = videoName.replace('.mp4', '_dash.mpd')

// 按 5s 一个区间分割视频
// exec(`mp4box -dash 5000 -rap -frag-rap ${videoName}`, (err, stdout, stderr)=>{
//     if(err){
//         console.log('执行错误')
//     }else{
//         console.log(stdout);
//         console.log(stderr);
//     }
// })

// 读取视频分段信息
// fs.readFile(videoDashMpd, 'utf-8', (err, data)=>{
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
//     }
// })

// 获取 mimeCodec 信息（也可以从 .mpd 文件中获取）
// exec(`mp4box -info ${videoDashName}`,(err, stdout, stderr)=>{
//     if(err){
//         console.log('执行错误')
//     }else{
//         // console.log(stdout);
//         // console.log(stderr);
//         // 需要从 stderr 中获取输入的信息，而不是stdout
//         let arr = stderr.split('\n')
//             .filter(e => e.includes('Codec Parameters'))
//             .map(e => e.split(':')[1].trim())
//         let mimeCodec = `video/mp4; codecs="${arr[0]}, ${arr[1]}"`
//     }
// })





