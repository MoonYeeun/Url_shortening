const express = require('express');
const router = express.Router();
const db = require('../../module/db');

//url redirect
router.get('/:id', async (req, res , next) => {
    let input = req.params.id;
    if(input == null) res.redirect('http://localhost:3000/');
    else{
        console.log(input);
        var url = 'localhost:8080/' + input;
        var query = {'short_url': url};
        try {
            const result = await db.find(query);
            console.log(`Connected to MongoDB: GET`);
            if(result._id){
                console.log(result);
                origin_url = 'https://'+result.origin_url;
                res.redirect(origin_url);
            }

        } catch(err) {
            console.log(err);
            res.status(404).send( {
                message : "Not found"
            })
        }
    }	
  });
  module.exports = router;