const express = require('express');
const router = express.Router();
const db = require('../module/db');
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

// url - shortening
router.post('/', (req, res) => {
	    //console.log('경로도착');
		let input_url = req.body.obj;
		console.log(input_url);
		MongoClient.connect(mongoURI,(err, db) => {
		if (err || input_url == null){
			console.log(`Error`, err);
			res.status(400).send( {
				message : "error"
			})
		} 
		else{
			console.log(`Connected to MongoDB : POST`);
			db = db.db('Url');
			db.collection('shortUrl', function(err, collection) {
				if (err) {
					console.log(err);
				} else {
					var query = {$or: [{ 'origin_url': {$eq: input_url} }, { 'short_url': {$eq: input_url} }]};
					collection.findOne(query).then(function (result){
						if(result){
							// if(result.origin_url.includes(input_url))
							// 	return res.json({
							// 		shortUrl : result.short_url
							// 	});
							// else
							// 	res.send(result.origin_url);
							return res.json({
								shortUrl : result.short_url
							});
			
						}
						else { // 해당 url 없는 경우 
							let insert_url = {
								'origin_url' : input_url,
								'short_url' : ""
							}
							collection.insertOne(insert_url).then(function(result){
								var id = result.ops[0]._id.toString(), ctr = 18;
								var id_num = parseInt(id.slice(ctr, (ctr+=6)), 16);
								var short_id = ShortURL.encode(id_num);
								var short_url = domain.concat(short_id);
								//console.log(short_url);
								//var update_query = [{'origin_url': input_url}, {$set: {'short_url': short_url}}];
								collection.updateOne({'origin_url': input_url}, {$set: {'short_url': short_url}}, function(err,result){
									if(err) console.log(err);
									else console.log('성공');
								})
	
							}, function(err){
								console.log(err);
							})
	
						}
	
							
					});
				
				}
			});
		}
	});
	
});
//url 인코딩 디코딩하기 
var ShortURL = new function() {
	var _alphabet = '23456789bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ-_';
	var _base = _alphabet.length;

	this.encode = function(num) {
		var str = '';
		while (num > 0) {
			str = _alphabet.charAt(num % _base) + str;
			num = Math.floor(num / _base);
		}
		return str;
	};

	this.decode = function(str) {
		var num = 0;
		for (var i = 0; i < str.length; i++) {
			num = num * _base + _alphabet.indexOf(str.charAt(i));
		}
		return str;
};
}
module.exports = router;