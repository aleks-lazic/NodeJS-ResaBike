var express = require('express');
var router = express.Router();
var session = require('express-session');
var bookingsManagement = require('../management/bookingsManagement');
var redirection = require('../modules/redirection');
var dbBook = require('../db/book');
var dbTrip = require('../db/trip');
var dbZone = require('../db/zone');

/* GET home page. */
router.get('/', function(req, res, next) {
    //redirection if not access
    var access = redirection.redirectAllBookings(session.user);
        if(access != 'ok'){
            res.redirect('/'+ res.locals.langUsed + access);
            return;
        }
        
    //get all zones with reservations to confirm 
    bookingsManagement.showAllZonesForReservations().then((zones) => {
        res.render('getAllBookings', {zones: zones, currentUser: session.user});
    })
});

/**
 * get bookings details for one zone
 */
router.get('/:id', function(req, res, next) {
    
    //redirection if not access
    var access = redirection.redirectOneBooking(session.user, req.params.id);
        if(access != 'ok'){
            res.redirect('/'+ res.locals.langUsed + access);
            return;
        }

    //first check if there's any reservation
    dbBook.getAllReservations().then((books) => {
        if(books.length == 0){
            dbZone.getZoneById(req.params.id).then((zone) =>{
                zone.books = [];
                res.render('getOneBooking', {object: zone, currentUser: session.user});            
            })
        } else {          
            //get all reservations for the zone
            bookingsManagement.addTripsToCorrectLineHours(req.params.id).then((object) => {
                bookingsManagement.sortDataToGetReservationsToCome(object).then((wholeObject) => {
                    res.render('getOneBooking', {object: wholeObject, currentUser: session.user});            
                })
            })
        }
    })
});

/**
 * get bookings historic for one zone id
 */
router.get('/historique/:id', function(req, res, next) {
    
    //redirection if not access
    var access = redirection.redirectOneBooking(session.user, req.params.id);
    if(access != 'ok'){
        res.redirect('/'+ res.locals.langUsed + access);
        return;
    }

    
        //first check if there's any reservation
        dbBook.getAllReservations().then((books) => {
            if(books.length == 0){
                dbZone.getZoneById(req.params.id).then((zone) =>{
                    zone.books = [];
                    res.render('getOneBookingHistorical', {object: zone, currentUser: session.user});            
                })
            } else {          
                //get all reservations for the zone
                bookingsManagement.addTripsToCorrectLineHours(req.params.id).then((object) => {
                    bookingsManagement.sortDataToGetHistorical(object).then((wholeObject)=> {
                        res.render('getOneBookingHistorical', {object: wholeObject, currentUser: session.user});            
                    })
                })
            }
        })
});

/**
 * delete a reservation by idbook
 */
router.delete('/:idBook', function(req, res, next){
    bookingsManagement.deleteReservation(req.params.idBook, res).then(() => {
        res.send('success');
    });
})

/** update a reservation (confirm it) by the zone admin*/
router.put('/', function(req, res, next){
    bookingsManagement.confirmReservation(req.body.idBook, res).then(() => {
        res.send('success');
    })
})

module.exports = router;
