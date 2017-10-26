var express = require('express');
var router = express.Router();
var dbStation = require('../db/station');
var dbBook = require('../db/book');
var email = require('../modules/email');
var crypto = require('crypto');


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
    let mailUser = req.body.email ;
    let mailSubject = 'Reservation confirmation - Resabike ';
    let mailContent = '<h1>Reservation confirmation</h1></br><p>Departure From :' + departureFrom + ', to : ' + arrivalTo + ', on : ' + timeDep + ', with : ' + nbBike + ' Bikes</p>' ;
    let randomNumber = Math.random() ;
    let tokenToEncrypt = mailUser + nbBike + timeDep + randomNumber;
    //console.log(departureFrom + " ," + arrivalTo + " , " + timeDep + ", " + nbBike + " ," + mailUser);

    let secretKey = 'youWillNeverKnowTheKey12345';
    let token = crypto.createHmac('sha256', secretKey)
                       .update(tokenToEncrypt)
                       .digest('hex');
    console.log(token);

    let arrProm = [] ;

    arrProm.push(dbStation.getStationIdByName(departureFrom));
    arrProm.push(dbStation.getStationIdByName(arrivalTo));

    Promise.all(arrProm).then((res)=>{
        let idDeparture = res[0];
        let idArrival = res[1];

        

        //Replace 1 with TOKEN when working with the tokens
        dbBook.insertReservation(timeDep, token, nbBike, idDeparture, idArrival, mailUser);

        //console.log(idDeparture + ", " + idArrival);
    })

    email.createEmail(mailUser, mailSubject, mailContent);



    //console.log(departureFrom + ", " + arrivalTo + " , " + timeDep + " , " + lineId + " , " + nbBike);

});

router.get('/delete/:token', function(req, res, next){
    var token = req.params.token ;
    console.log(token);
    dbBook.deleteReservationByToken(token).then(()=>{
        //If successfull
          
    });
})

// router.get('/back', function(req, res, next){
//     /* GET back to home page. */
//     return res.redirect('index');
// });


module.exports = router;