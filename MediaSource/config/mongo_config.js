// 先引入
const mongoose = require('mongoose');
 
// 链接数据库  固定前缀 mongodb  127.0.0.1:27017 是本机域名，端口号默认为27017
// 也可以连接到别的主机，操作别人的数据库
// user-project为数据库名字，可以是已有的，也可以是要新建的，如果没有则会自动创建
mongoose.connect('mongodb://127.0.0.1:27017/video_test');

mongoose.connection.on('connected',function(){
    console.log('mongodb 连接成功');
})
//3.连接失败
mongoose.connection.on('error',function(err){
    console.log('mongodb 连接错误');
})
//4.断开连接
mongoose.connection.on('disconnection',function(){
    console.log('mongodb 断开连接');
})