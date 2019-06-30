var express = require('express');
var router = express.Router();
var traces = require('../models/Traces')
var points = require('../models/Points')

//引入数据库连接模块
const pool = require('./conn');

/* GET home page. */
router.get('/checkLogin', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//登录接口
router.post('/checkLogin', (req, res) => {
  let {username,password} = req.body;
  const sqlStr = `select * from userlist where username ='${username}' and password ='${password}'`
  pool.connect().then(client=>{
    client.query(sqlStr).then(data=>{
      client.release()
      //console.log(data.rows);
      res.send(data.rows);

    }).catch(e => {
      client.release()
      console.error('query error', e.message, e.stack)
    })
  })
});

//全部轨迹查询借口呀·
router.post('/searchTraces', (req, res) => {
  let {from,to} = req.body;
  console.log(from,to)
  traces.find({"年份":{"$gte": from, "$lte": to}},function (error,doc) {
    if(error){
      console.error(error)
    }else{
      //console.log(doc)
      res.send(doc)
    }
  })
});

//获取文人轨迹数组函数
function getTrace(i, poets,poetTraces,res){
  // traces.find({"作家":poets[i]},function (error,doc) {
  //   if (error) {
  //     console.log("Error!")
  //   } else {
  //     if(i < poets.length){
  //       poetTraces.push(doc)
  //       //console.log(i)
  //       if(i == poets.length-1){
  //         //console.log(poetTraces)
  //         res.send(poetTraces)
  //       }
  //       i++
  //       getTrace(i, poets,poetTraces,res)
  //     }
  //   }
  // })
  traces.find({"作家":poets[i]})
    .sort({年份:1})
    .exec(function (error,doc) {
      if(error){
        console.error(error)
      }else{
        if(i < poets.length){
          poetTraces.push(doc)
          //console.log(i)
          if(i == poets.length-1){
            //console.log(poetTraces)
            res.send(poetTraces)
          }
          i++
          getTrace(i, poets,poetTraces,res)
        }
      }
    })
}

//获取文人轨迹数组接口
router.post('/poetTraces', (req, res) => {
  var poets = req.body.poets;
  var poetTraces=[]
  getTrace(0,poets,poetTraces,res)
});

//全作品地域分布
router.post('/searchPoems', (req, res) => {
  let {from,to} = req.body;
  points.aggregate([
    {$match:{"年份":{"$gte": from, "$lte": to},"系年作品":{$exists:true}}},
    {$group:{
        _id: {地点:'$活动地市县',经度:'$经度',纬度:'$纬度'},
        count:{$sum: 1}
      }},
    {$project : {"_id": 0, "地点":"$_id.地点", "经度":"$_id.经度",  "纬度":"$_id.纬度", "count" : 1}},
    {$sort: {count: -1}},
  ]).then(data=>{
    //console.log(data)
    res.send(data)
  })
});

//获取文人作品地域分布函数
function getPoem(i, poets,poetPoems,res){
  points.aggregate([
    {$match:{"作家":poets[i],"系年作品":{$exists:true}}},
    {$group:{
        _id: {地点:'$活动地市县',经度:'$经度',纬度:'$纬度'},
        count:{$sum: 1}
      }},
    {$project : {"_id": 0, "地点":"$_id.地点", "经度":"$_id.经度",  "纬度":"$_id.纬度", "count" : 1}},
    {$sort: {count: -1}},
  ]).then(data=>{
    if(i < poets.length){
      poetPoems.push(data)
      //console.log(i)
      if(i == poets.length-1){
        //console.log(poetPoems)
        res.send(poetPoems)
      }
      i++
      getPoem(i, poets,poetPoems,res)
    }
  })
}

//文人作品地域分布
router.post('/poetPoems', (req, res) => {
  var poets = req.body.poets;
  console.log(poets)
  //let poetTraces = new Array(poets.length)
  var poetPoems=[]
  getPoem(0,poets,poetPoems,res)
});


router.post('/register', (req, res) => {
  let {username,password} = req.body;
  const sqlStr = `select * from userlist where username ='${username}' and password ='${password}'`
  _res=res
  pool.connect().then(client=>{
    client.query(`insert into userlist(username,password) VALUES($1::varchar,$2::varchar)`,[req.body.username,req.body.password]).then(data=>{

    }).then(res=>{
      // 查询用户
      client.query(sqlStr).then(data=>{
        client.release()
        //console.log(data.rows);
        _res.send(data.rows);
      })
    }).catch(e => {
      client.release()
      console.error('query error', e.message, e.stack)
    })
  })
});

module.exports = router;
