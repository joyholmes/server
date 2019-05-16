var pg = require('pg');

// 数据库配置
var config = {
  user:"postgres",
  database:"postgres",
  password:"123456",
  port:5432,
  host: '47.92.251.238',
  // 扩展属性
  max:20, // 连接池最大连接数
  idleTimeoutMillis:3000, // 连接最大空闲时间 3s
}

// 创建连接池
var pool = new pg.Pool(config);

module.exports = pool;