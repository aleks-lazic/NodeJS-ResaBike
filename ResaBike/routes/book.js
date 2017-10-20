var express = require('express');
var router = express.Router();
var dbStation = require('../db/station');
var dbBook = require('../db/book');


/* GET book Page */
router.get('/book', function(req, res, next) { 
    res.render('book');
});

router.post('/reservation', function(req, res, next){
    
});

router.post('/confirm', function(req, res, next){

    //Retrieved the data from book and index page
    let departureFrom = req.body.from;
    let arrivalTo = req.body.arrival ;
    let timeDep = req.body.timeDep ;
    let nbBike = req.body.nbBike ;
    let mail = req.body.email ;

    console.log(departureFrom + " ," + arrivalTo + " , " + timeDep + ", " + nbBike + " ," + mail);

    let arrProm = [] ;

    arrProm.push(dbStation.getStationIdByName(departureFrom));
    arrProm.push(dbStation.getStationIdByName(arrivalTo));

    Promise.all(arrProm).then((res)=>{
        let idDeparture = res[0];
        let idArrival = res[1];

        

        //Replace 1 with TOKEN when working with the tokens
        //dbBook.insertReservation(timeDep, 1, nbBike, idDeparture, idArrival, mail);

        //console.log(idDeparture + ", " + idArrival);
    })



    //console.log(departureFrom + ", " + arrivalTo + " , " + timeDep + " , " + lineId + " , " + nbBike);

});

// router.get('/back', function(req, res, next){
//     /* GET back to home page. */
//     return res.redirect('index');
// });


module.exports = router;