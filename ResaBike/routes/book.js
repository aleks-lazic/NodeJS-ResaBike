var express = require('express');
var router = express.Router();
var dbStation = require('../db/station');


/* GET book Page */
router.get('/book', function(req, res, next) { 
    res.render('book');
});

module.exports = router;