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
    let dateTravelUser = req.body.dateTravel ;
    let nbBike = req.body.nbBike ;

    //Comparing the date, time with the one selected from the user
    let currentTime = new Date();
    let currentHour = currentTime.getHours();
    let currentMinute = currentTime.getMinutes();
    let stringHourMinute = currentHour + ":" + currentMinute + ":00" ;

    let currentYear = currentTime.getFullYear().toString();
    let currentMonth = (currentTime.getMonth()+1).toString();
    let currentDay = currentTime.getDate().toString();
    //Date Of Today
    let stringCurrentDate = currentYear + '-' + currentMonth + '-' + currentDay ;

    //console.log(stringHourMinute);

    let url = "https://timetable.search.ch/api/route.en.json?from=" + departureFrom + "&to=" + arrivalTo + "&date=" + dateTravelUser;
    let arrayTimeDeparture = [] ;
    let arrayTimeArrival = [] ;

    //console.log('From : ' + departureFrom + ', To : ' + arrivalTo, " at Date : " + dateTravel);
    requestData.getDataFromAPI(url)
    .then((obj) => {

        //console.log(obj);
        var objct = obj.connections ;
        //console.log(objct);

        for (let i = 0; i < objct.length ; i++) {
            var legs = objct[i].legs ;
            for (let j = 0 ; j < legs.length ; j++){
                if(legs[j].type == "post" || legs[j].type == "bus" ){
                    //console.log(legs[j].departure);
                    let dateSplit = legs[j].departure.split(" ");
                    //console.log(dateSplit[0].split("-")[2]);
                    //console.log(dateTravelUser.split("-")[2]);
                    if(dateSplit[0].split("-")[2] == dateTravelUser.split("-")[2] && stringCurrentDate != dateTravelUser){
                        arrayTimeDeparture.push(objct[i].departure);
                        arrayTimeArrival.push(objct[i].arrival);
                        console.log("Entered if");
                    }
                    if(stringCurrentDate == dateTravelUser && dateSplit[1] > stringHourMinute){
                        arrayTimeDeparture.push(objct[i].departure);
                        arrayTimeArrival.push(objct[i].arrival);
                        console.log("entered else if");
                    }
                }
            }
        }

        res.render('book', {arrayTimeDeparture: arrayTimeDeparture, arrayTimeArrival: arrayTimeArrival, departureFrom: departureFrom, arrivalTo: arrivalTo, nbBike: nbBike, dateTravelUser: dateTravelUser});
    }).catch((err)=>{
        res.send('Error : ' + err.message);
    })

});

module.exports = router;
