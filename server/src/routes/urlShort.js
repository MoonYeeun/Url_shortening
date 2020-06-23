const express = require('express');
const router = express.Router();
const db = require('../../module/db');
let domain= 'localhost:8080/';

// url - shortening
router.post('/', async (req, res) => {
    let input_url = req.body.obj;
    console.log(input_url);
    // null 값 들어온 경우
    if(input_url == '' || input_url == null) {
        res.status(200).send( {
            message : "값을 입력하세요."
        })
    } else {
        try {
            // url 있는지 확인
            const query = {$or: [{ 'origin_url': {$eq: input_url} }, { 'short_url': {$eq: input_url} }]};
            const result = await db.find(query);
            
            // 이미 존재할 경우 
            if(result) {
                console.log(result);
                return res.json({
                    shortUrl : result.short_url
                });
            } else { // 없는 경우
                let insert_url = {
                    'origin_url' : input_url,
                    'short_url' : ""
                }
                const insert_result = await db.insert(insert_url);
                let id = insert_result.ops[0]._id.toString(), ctr = 18;
                let id_num = parseInt(id.slice(ctr, (ctr+=6)), 16);
                let short_id = ShortURL.encode(id_num);
                let short_url = domain.concat(short_id);

                const query = [{'origin_url': input_url}, {$set: {'short_url': short_url}}];
                await db.update(query);
                
                return res.json({
                    shortUrl : short_url
                });
            }
        } catch(err) {
            res.status(400).send( {
                message : "error"
            })
        }
    } 
});

//url 인코딩 디코딩하기 
let ShortURL = new function() {
    let _alphabet = '23456789bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ-_';
    let _base = _alphabet.length;

    this.encode = function(num) {
        let str = '';
        while (num > 0) {
            str = _alphabet.charAt(num % _base) + str;
            num = Math.floor(num / _base);
        }
        return str;
    };

    this.decode = function(str) {
        let num = 0;
        for (let i = 0; i < str.length; i++) {
            num = num * _base + _alphabet.indexOf(str.charAt(i));
        }
        return str;
    };
}
module.exports = router;