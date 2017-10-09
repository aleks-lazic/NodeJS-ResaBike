var express = require('express');
var router = express.Router();
var dbStation = require('../db/station');


/* GET home page. */
router.get('/', function(req, res, next) { 
    res.render('index', { title: 'ResaBike'});
});

/* GET all stations for autocompletion. */
router.get('/getAllStations', function(req, res) {
    //console.log('suis la'); 
    dbStation.getAllStations().then((result)=> {
        res.send(result);
    })
});

router.post('/book', function(req, res, next){
    var departureFrom = req.body.departureFrom ;
    var arrivalTo = req.body.arrivalTo ;
    console.log('From : ' + departureFrom + ', To : ' + arrivalTo);
    res.render('book');
});


module.exports = router;
