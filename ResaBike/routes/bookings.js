var express = require('express');
var router = express.Router();
var session = require('express-session');
var bookingsManagement = require('../management/bookingsManagement');
var redirection = require('../modules/redirection');

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
        res.render('bookings', {zones: zones, currentUser: session.user});
    })
});


module.exports = router;
