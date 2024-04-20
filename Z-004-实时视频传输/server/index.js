const express = require('express')
const nodeMediaServer = require('node-media-server');

const config = {
    common:{
        bind: '0.0.0.0'
    },
    // 接受推过来的流
    rtmp:{
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60
    },
    // 转发推流的信息
    http:{
        port: 8989,
        allow_origin: '*'
    },
    // 配置流媒体转码
    trans: {
        ffmpeg: '/usr/bin/ffmpeg',//指明FFmpeg位置
        // 转码任务
        tasks: [
            {
                app: 'flv',         // 对于特定的任务名才进行处理
                ac: 'acc',          // 表示音频编解码器使用AAC（Advanced Audio Coding）
                vc: 'libx264',      // 表示视频编解码器使用H.264，通过 `libx264`库实现
                hls: true,          // 开启HTTP Live Streaming（HLS）转码，HLS是苹果开发的一种用于网络直播的流媒体通信协议
                hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
                dash: true,         // 开启Dynamic Adaptive Streaming over HTTP（DASH）转码，DASH是另一种用于网络流媒体传输的协议
                dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
            }
        ]
    }
}

/*
    hlsFlags: [hls_time=2:hls_list_size=3:hls_flags=delete_segments]'` 是FFmpeg的HLS转码参数。其中：
    * `hls_time=2` 表示每个HLS片段（segment）的时长为2秒。
    * `hls_list_size=3` 表示HLS播放列表（playlist）中最多包含3个片段。
    * `hls_flags=delete_segments` 表示删除旧的HLS片段，以节省存储空间。

    dashFlags: `'[f=dash:window_size=3:extra_window_size=5]'` 是FFmpeg的DASH转码参数。其中：
    * `f=dash` 表示输出格式为DASH。
    * `window_size=3` 和 `extra_window_size=5` 与DASH流的处理有关，通常涉及到缓存和片段的存储策略。
*/

var nms = new nodeMediaServer(config);
nms.run();

const app = express();

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})

app.get('/test',(req, res)=>{
    console.log('来了');
    res.json({res: 'ok'})
})

app.use((req, res)=>{
    res.status(404).send()
})

app.listen(3000, ()=>{console.log('3000 listening')})