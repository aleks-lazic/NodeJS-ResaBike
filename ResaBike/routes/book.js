var express = require('express');
var router = express.Router();
var dbStation = require('../db/station');


/* GET home page. */
router.get('/book', function(req, res, next) { 
    res.render('book', { title: 'ResaBike'});
});

module.exports = router;