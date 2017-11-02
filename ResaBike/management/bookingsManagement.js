var dbZone = require('../db/zone');
var dbBook = require('../db/book');
var dbTrip = require('../db/trip');
var dbLine = require('../db/line');
var dbZone = require('../db/zone');
var dbStation = require('../db/station');

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
                        console.log(listBookDetails[k]);
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

var getAllTripsForEachReservation = function(book){
    return new Promise((resolve, reject) => {
        dbTrip.getAllTripsByIdBooking(book.id).then((listTrips) => {
            //create the book object
            var bookDetails = {
                book: book,
                lines: [],
                idZone: 0
            };
            let promises = [];
            for(let k = 0 ; k<listTrips.length ; k++){
                promises.push(dbLine.getZoneIdByLine(listTrips[k].idLine).then((idZone) => {
                    bookDetails.lines.push(listTrips[k].idLine);
                    bookDetails.idZone = idZone;
                }));                            
            }
            Promise.all(promises).then(() => {
                resolve(bookDetails);                
            })
        });                           
    })
}

var showReservationsForOneZone = function(idZone){
    return new Promise((resolve, reject) => {
        dbZone.getZoneById(idZone).then((zone) => {
            //get all reservations for the zone
            dbBook.getAllReservations().then((books) => {
                //get all trips for each book
                var promises = [];
                books.forEach(function(b) {
                    promises.push(getAllTripsForEachReservation(b));
                }, this);
                //now that we have all the trips
                Promise.all(promises).then((listBookDetails) => {
                    for(let k = 0 ; k<listBookDetails.length ; k++){
                        if(listBookDetails[k].idZone == zone.id){
                            if(zone.bookDetails == null){
                                zone.bookDetails = [];
                                zone.bookDetails.push(listBookDetails[k]);
                            } else {
                                zone.bookDetails.push(listBookDetails[k]);                                    
                            }
                        }
                    }
                    resolve(zone);
                })
            })
        })
    })
}

var getAllBookDetails = function(idZone){
    return new Promise((resolve, reject) => {
        showReservationsForOneZone(idZone).then((zone) => {
            var promises = [];
            zone.bookDetails.forEach(function(b){
                console.log(b.book.ArrivalId);
                //get the departure station
                promises.push(dbStation.getStationById(b.book.DepartureId).then((station) => {
                    b.DepartureId = station.name;
                }));
                promises.push(dbStation.getStationById(b.book.ArrivalId).then((station) => {
                    b.ArrivalId = station.name;
                }));
            })
            Promise.all(promises).then(() => {
                resolve(zone);
            })
        })
    })
}

exports.getAllBookDetails = getAllBookDetails;
exports.showReservationsForOneZone = showReservationsForOneZone;
exports.showAllZonesForReservations = showAllZonesForReservations;