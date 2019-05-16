var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//创建Schema
var traceSchema = new Schema({
  作家:String,
  朝代:String,
  年份:Number,
  月:String,
  日:String,
  年岁:String,
  活动分期:String,
  endx:Number,
  endy:Number,
  startx:Number,
  starty:Number,
  起始点:String,
  地点名胜:String,
  目的地省:String,
  目的地市县:String,
  任职官名:String,
  活动内容或创作缘起:String,
  交游者姓名:String,
});
module.exports = traceSchema;
