var express = require('express');
var router = express.Router();
var dbStation = require('../db/station');
var dbBook = require('../db/book');
var dbTrip = require('../db/trip');
var email = require('../modules/email');
var crypto = require('crypto');


router.post('/confirm', function(req, res, next){
    //Retrieved the data from book and index page
    let departureFrom = req.body.from;
    let arrivalTo = req.body.arrival ;
    let timeDep = req.body.timeDep ;
    let nbBike = Number(req.body.nbBike) ;
    let mailUser = req.body.email ;
    let lines = req.body.lines.split(',');
    let placesAvailable = Number(req.body.placesAvailable);
    let trips = JSON.parse(req.body.trips);
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;

    
    //create everything we need for the mail
    //Creating a random token(hash) to be able to delete the reservation
    let randomNumber = Math.random() ;
    let tokenToEncrypt = mailUser + nbBike + timeDep + randomNumber;

    //secret key for the token
    let secretKey = 'youWillNeverKnowTheKey12345';
    let token = crypto.createHmac('sha256', secretKey)
                       .update(tokenToEncrypt)
                       .digest('hex');

    //if nbBike wanted is greather than the places available
    console.log("PlacesAvailable" + placesAvailable);
    if(nbBike > placesAvailable){
        //send email that the confirmation will be confirmed
        sendWaitingMail(token,departureFrom, arrivalTo, timeDep, nbBike, mailUser, lines ,trips, firstname, lastname, res);
    } else {
        //create the url with the token
        let urlToDelete = "http://localhost:3000/book/delete/" + token ;
        sendConfirmationMailAndAddToDb(token, urlToDelete, departureFrom, arrivalTo, timeDep, nbBike, mailUser, lines, trips, firstname, lastname, res);
    }
});

router.get('/delete/:token', function(req, res, next){
    
    var token = req.params.token ;

    dbBook.getReservationByToken(token).then((book) => {
        dbTrip.deleteTrip(book.id);
        dbBook.deleteReservationByToken(token).then(()=>{
            //If successfull redirect user to a delete confirmation page
            res.render('delete');
        });
    })
})

router.get('/back', function(req, res, next){
     /* GET back to home page. */
    return res.redirect('/');
});

function sendConfirmationMailAndAddToDb(token, urlToDelete, departureFrom, arrivalTo, timeDep, nbBike, mailUser, lines, trips, firstname, lastname, res){
    console.log('confirmation mail');
    //mail subject
    let mailSubject = 'Reservation confirmation - Resabike ';
    //mail content
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
    
    //array promises 
    let arrProm = [] ;

    arrProm.push(dbStation.getStationIdByName(departureFrom));
    arrProm.push(dbStation.getStationIdByName(arrivalTo));

    Promise.all(arrProm).then((resu)=>{
        //get results from array promises
        let idDeparture = resu[0];
        let idArrival = resu[1];
        //insert the reservation
        var promisesTrip = [];
        dbBook.insertReservation(timeDep, token, nbBike, idDeparture, idArrival, mailUser, true, firstname, lastname).then((idBook) => {
            for(let k = 0 ; k<lines.length ; k++){
                console.log(trips[k].idDeparture + " FUCK " + trips[k].idTerminal);
                promisesTrip.push(dbTrip.insertTrip(timeDep, lines[k], idBook, trips[k].departureId, trips[k].exitId));                
            }
            Promise.all(promisesTrip).then(() => {
                email.createEmail(mailUser, mailSubject, mailContent);
                res.send('success');              
            })
        });
    })
}

function sendWaitingMail(token, departureFrom, arrivalTo, timeDep, nbBike, mailUser, lines, trips, firstname, lastname, res){
    //mail subject
    let mailSubject = 'Reservation not confirmed - Resabike ';
    //mail content
    let mailContent = `<div>
                            <h1>Reservation not confirmed</h1>
                        </div>
                        <div>
                            <p>Date : ${timeDep}
                            <br>Departure From : ${departureFrom}
                            <br>To : ${arrivalTo}
                            <br>Numbers of bike : ${nbBike}</p>
                        </div>       
                        <br>
                        <div>
                        <p>Your reservation has been taken into account. An administrator will contact you soon for confirmation.</a></p>
                        </div>` ;

    //array promises 
    let arrProm = [] ;

    arrProm.push(dbStation.getStationIdByName(departureFrom));
    arrProm.push(dbStation.getStationIdByName(arrivalTo));

    Promise.all(arrProm).then((resu)=>{
        //get results from array promises
        let idDeparture = resu[0];
        let idArrival = resu[1];
        //insert the reservation
        var promisesTrip = [];
        dbBook.insertReservation(timeDep, token, nbBike, idDeparture, idArrival, mailUser, false, firstname, lastname).then((idBook) => {
            for(let k = 0 ; k<lines.length ; k++){
                promisesTrip.push(dbTrip.insertTrip(timeDep, lines[k], idBook, trips[k].departureId, trips[k].exitId));                
            }
            Promise.all(promisesTrip).then(() => {
                email.createEmail(mailUser, mailSubject, mailContent);
                res.send('needConfirmation');              
            })
        });
    })
}

module.exports = router;