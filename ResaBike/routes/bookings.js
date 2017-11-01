var express = require('express');
var router = express.Router();
var session = require('express-session');


/* GET home page. */
router.get('/', function(req, res, next) {
     
    res.render('bookings');
});


module.exports = router;
