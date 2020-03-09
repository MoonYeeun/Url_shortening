const express = require('express');
const router = express.Router();
const mongoURI = "mongodb://localhost:27017/Url";
//const mongoose = require("mongoose");
var MongoClient = require('mongodb').MongoClient;
const connectOptions = {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useNewUrlParser: true
};
var db;
let domain= 'localhost:8080/';

//mongoose.Promise = global.Promise;
//model 생성
// let shortUrl_schema = new mongoose.Schema({
// 	origin_url : {type: String, required: true},
// 	short_url : {type: String, required: true, unique : true}
// });
//let shortUrl = mongoose.model('shortUrl',shortUrl_schema);

// var urlShort = require('./urlShort');
// router.use('/', urlShort);

module.exports = router;