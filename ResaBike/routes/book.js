var express = require('express');
var router = express.Router();
var dbStation = require('../db/station');


/* GET book Page */
router.get('/book', function(req, res, next) { 
    res.render('book');
});

router.post('/reservation', function(req, res, next){
    let departureFrom = req.body.from;
    console.log(departureFrom);
});


module.exports = router;