var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//创建Schema
var pointsSchema = new Schema({
  作家:String,
  朝代:String,
  年份:Number,
  月:String,
  日:String,
  年岁:String,
  活动分期:String,
  地点名胜:String,
  今活动地省:String,
  活动地市县:String,
  任职官名:String,
  活动内容或创作缘起:String,
  交游者姓名:String,
  系年作品:String,
  经度:Number,
  纬度:Number,
});
module.exports = pointsSchema;