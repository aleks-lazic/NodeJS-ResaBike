var express = require('express');
var router = express.Router();
var dbStation = require('../db/station');


/* GET home page. */
router.get('/', function(req, res, next) { 
    res.render('index', { title: 'ResaBike'});
});

/* GET all stations for autocompletion. */
router.get('/getAllStations', function(req, res, next) {
    console.log('suis la'); 
    dbStation.getAllStations().then((result)=> {
        res.send(result);
    })
});


module.exports = router;
