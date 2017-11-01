var dbZone = require('../db/zone');
var dbBook = require('../db/book');
var dbTrip = require('../db/trip');
var dbLine = require('../db/line');

var showAllZonesForReservations = function(){
    return new Promise((resolve, reject) => {
        //first get all zones
        dbZone.getAllZones().then((zones) => {
            //get all reservations that are not confirmed
            dbBook.getAllReservationsNotConfirmed().then((books) => {
                //get all trips for each book not confirmed
                var promises = [];
                books.forEach(function(b) {
                    promises.push(getAllTripsForEachReservation(b));
                }, this);
                //now that we have all the trips
                Promise.all(promises).then((listBookDetails) => {
                    for(let k = 0 ; k<listBookDetails.length ; k++){
                        for(let i = 0 ; i<zones.length ; i++){
                            if(listBookDetails[k].idZone == zones[i].id){
                                if(zones[i].books == null){
                                    zones[i].books = [];
                                    zones[i].books.push(listBookDetails[k].book);
                                } else {
                                    zones[i].books.push(listBookDetails[k].book);                                    
                                }
                            }
                        }
                    }

                    resolve(zones);
                })
            })
        })
    })
}

var getAllBookForOneZone = function(zone){
    
}

var getAllTripsForEachReservation = function(book){
    return new Promise((resolve, reject) => {
        dbTrip.getAllTripsByIdBooking(book.id).then((listTrips) => {
            for(let k = 0 ; k<listTrips.length ; k++){
                dbLine.getZoneIdByLine(listTrips[k].idLine).then((idZone) => {
                    var bookDetails = {
                        book: book,
                        idZone: idZone
                    };
                    resolve(bookDetails);
                });                            
            }
        });                           
    })
}

exports.showAllZonesForReservations = showAllZonesForReservations;