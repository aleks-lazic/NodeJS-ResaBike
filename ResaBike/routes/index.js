var express = require('express');
var router = express.Router();
var dbStation = require('../db/station');
var requestData = require('./testDataApi');


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
    
    let departureFrom = req.body.departureFrom ;
    let arrivalTo = req.body.arrivalTo ;
    let dateTravel = req.body.dateTravel ;
    let url = "https://timetable.search.ch/api/route.en.json?from=" + departureFrom + "&to=" + arrivalTo + "&date=" + dateTravel;
    let arrayTimeDeparture = [] ;
    let arrayTimeArrival = [] ;

    console.log('From : ' + departureFrom + ', To : ' + arrivalTo, " at Date : " + dateTravel);
    requestData.getDataFromAPI(url)
    .then((obj) => {
        //console.log(obj);
        var objct = obj.connections ;

         console.log(objct);

        for (let i = 0; i < objct.length ; i++) {
            arrayTimeDeparture.push(objct[i].departure);
            arrayTimeArrival.push(objct[i].arrival);
        }

        res.render('book', {arrayTimeDeparture: arrayTimeDeparture, arrayTimeArrival: arrayTimeArrival, departureFrom: departureFrom, arrivalTo: arrivalTo});
    }).catch((err)=>{
        res.send('Error : ' + err.message);
    })

});


module.exports = router;
