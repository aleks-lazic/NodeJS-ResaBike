var express = require('express');
var router = express.Router();
var dbStation = require('../db/station');
var dbBook = require('../db/book');
var email = require('../modules/email');
var crypto = require('crypto');


router.post('/confirm', function(req, res, next){

    //Retrieved the data from book and index page
    let departureFrom = req.body.from;
    let arrivalTo = req.body.arrival ;
    let timeDep = req.body.timeDep ;
    let nbBike = req.body.nbBike ;
    let mailUser = req.body.email ;

    //Creating a random token(hash) to be able to delete the reservation
    let randomNumber = Math.random() ;
    let tokenToEncrypt = mailUser + nbBike + timeDep + randomNumber;
    //console.log(departureFrom + " ," + arrivalTo + " , " + timeDep + ", " + nbBike + " ," + mailUser);

    let secretKey = 'youWillNeverKnowTheKey12345';
    let token = crypto.createHmac('sha256', secretKey)
                       .update(tokenToEncrypt)
                       .digest('hex');
    //console.log(token);

    let urlToDelete = "http://localhost:3000/book/delete/" + token ;

    let mailSubject = 'Reservation confirmation - Resabike ';
    let mailContent = `<div>
                            <h1>Reservation Confirmation</h1>
                        </div>
                        
                        <div>
                            <p>Date : ${timeDep}
                            <br>Departure From : ${departureFrom}
                            <br>To : ${arrivalTo}
                            <br>Numbers of bike : ${nbBike}</p>
                        </div>
                        
                        <br>
                        <div>
                        <p>If you want to delete the reservation, you juste have to press this link : <a href="${urlToDelete}">Delete confirmation</a></p>
                        </div>` ;
    
    //console.log(urlToDelete);

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
    //console.log(token);
    dbBook.deleteReservationByToken(token).then(()=>{
        //If successfull redirect user to a delete confirmation page
        res.render('delete');
    });

})

router.get('/back', function(req, res, next){
     /* GET back to home page. */
    return res.redirect('/');
});


module.exports = router;