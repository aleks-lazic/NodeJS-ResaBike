var express = require('express');
var router = express.Router();
var dbStation = require('../db/station');


/* GET book Page */
router.get('/book', function(req, res, next) { 
    res.render('book');
});

router.use(function(req, res){
    if(req.statusCode == 404){
        res.redirect('/');
    }
});

module.exports = router;