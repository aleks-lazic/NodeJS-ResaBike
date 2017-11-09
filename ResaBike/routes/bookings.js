var express = require('express');
var router = express.Router();
var session = require('express-session');
var bookingsManagement = require('../management/bookingsManagement');
var redirection = require('../modules/redirection');
var dbBook = require('../db/book');
var dbTrip = require('../db/trip');

/* GET home page. */
router.get('/', function(req, res, next) {

    //redirection if not access
    var access = redirection.redirectAllZones(session.user);
        if(access != 'ok'){
            res.redirect(access);
            return;
        }
    //get all zones with reservations to confirm 
    bookingsManagement.showAllZonesForReservations().then((zones) => {
        console.log(zones[0].books[0]);
        res.render('getAllBookings', {zones: zones, currentUser: session.user});
    })
});

router.get('/:id', function(req, res, next) {
    
    //redirection if not access
    var access = redirection.redirectOneZone(session.user);
        if(access != 'ok'){
            res.redirect(access);
            return;
        }

    //get all reservations for the zone
    bookingsManagement.addTripsToCorrectLineHours(req.params.id).then((wholeObject) => {
        console.log(JSON.stringify(wholeObject));
        res.render('getOneBooking', {object: wholeObject, currentUser: session.user});
    })

});

router.delete('/:idBook', function(req, res, next){
    bookingsManagement.deleteReservation(req.params.idBook, res).then(() => {
        res.send('success');
    });
})

router.put('/', function(req, res, next){
    bookingsManagement.confirmReservation(req.body.idBook, res).then(() => {
        res.send('success');
    })
})

module.exports = router;
