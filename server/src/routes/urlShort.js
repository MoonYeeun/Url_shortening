const express = require('express');
const router = express.Router();
const db = require('../../module/db');
let domain= 'localhost:8080/';

// url - shortening
router.post('/', async (req, res) => {
    let input_url = req.body.obj;
    console.log(input_url);
    // 공백 제거 
    if(input_url != null) input_url = input_url.replace(/(\s*)/g, "");
    // url 있는지 확인
    const query = {$or: [{ 'origin_url': {$eq: input_url} }, { 'short_url': {$eq: input_url} }]};
    const result = await db.find(query);
    console.log(result);
    // 이미 존재할 경우 
    if(result._id) {
        return res.json({
            shortUrl : result.short_url
        });
    } // 없을 경우
    else if(result == null) {
        let insert_url = {
            'origin_url' : input_url,
            'short_url' : ""
        }
        // db insert 후 url - shortening 시행
        const result = await db.insert(insert_url);
        var id = result.ops[0]._id.toString(), ctr = 18;
        var id_num = parseInt(id.slice(ctr, (ctr+=6)), 16);
        var short_id = ShortURL.encode(id_num);
        var short_url = domain.concat(short_id);

        query = {'origin_url': input_url}, {$set: {'short_url': short_url}};
        result = await db.update(query);
        console.log(result);
    } else {
        res.status(400).send( {
            message : "error"
        })
    }
    // try {
    //     // 공백 제거 
    //     if(input_url != null) input_url = input_url.replace(/(\s*)/g, "");
    //     const query = {$or: [{ 'origin_url': {$eq: input_url} }, { 'short_url': {$eq: input_url} }]};
    //     const result = await db.find(query);
    //     console.log(result);
    //     // 이미 존재할 경우 
    //     if(result._id) {
    //         return res.json({
    //             shortUrl : result.short_url
    //         });
    //     } if(result == null) {
    //         let insert_url = {
    //             'origin_url' : input_url,
    //             'short_url' : ""
    //         }
    //         // db insert 후 url - shortening 시행
    //         const result = await db.insert(insert_url);
    //         var id = result.ops[0]._id.toString(), ctr = 18;
    //         var id_num = parseInt(id.slice(ctr, (ctr+=6)), 16);
    //         var short_id = ShortURL.encode(id_num);
    //         var short_url = domain.concat(short_id);

    //         query = {'origin_url': input_url}, {$set: {'short_url': short_url}};
    //         result = await db.update(query);
    //         console.log(result);
    //     }

    // } catch(err) {
    //     res.status(400).send( {
    //         message : "error"
    //     })
    // }
	
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