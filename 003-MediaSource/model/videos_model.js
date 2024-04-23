const mongoose = require('mongoose');
 
// Mongoose 的一切始于 Schema
// 每个 schema 都会映射到一个 MongoDB collection ，并定义这个collection里的文档的构成。
const Schema = mongoose.Schema;
 
// 设置有多少个字段 字段名，每个字段对应的数据类型
const videoType = {
    videoName:String,
    segments:Array,
    mimeType:String
}
 
// 创建一个名为 User的模型，那么在数据库中会创建一个集合Users （即加了一个后缀-s）
// 所以一般给模型起名字的时候，最好不要在加上-s的后缀
// 第二个参数为一个 Schema 对象 ，表示该模型中的字段分别需要运用什么类型的数据限制
const videoModel = mongoose.model('Video', new Schema(videoType));
 
module.exports = videoModel;