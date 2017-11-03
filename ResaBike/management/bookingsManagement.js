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
            dbBook.getAllReservations().then((books) => {
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

var assignTripToALineAndHour = function(trip, nbBikes){
    return new Promise((resolve, reject) => {
        var tripLineHour = {
            line : trip.idLine,
            dateTime: trip.departureHour,
        };
        var tripObject = {
            from: trip.idDeparture,
            to: trip.idTerminal,
            nbBike: nbBikes
        }
        tripLineHour.trip = tripObject;
        resolve(tripLineHour);
    })
}
var getAllInformationsWeNeedForReservations = function(idZone){
    return new Promise((resolve, reject) => {
        //get the zone
        dbZone.getZoneById(idZone).then((zone) => {
            //get zones informations
            var zoneObject = {
                idZone: zone.id,
                name: zone.name
            }; 
            //add the zone to the whole object
            var wholeObject = {
                zone: zoneObject
            };
            //get all books
            dbBook.getAllReservations().then((books) => {
                //find all trips for each book
                var promises = [];
                var linesDeparture = [];
                for(let k = 0 ; k<books.length ; k++){
                    dbTrip.getAllTripsByIdBooking(books[k].id).then((trips) => {
                        for(let i = 0 ; i<trips.length ; i++){
                            promises.push(assignTripToALineAndHour(trips[i], books[k].nbBike));
                        }
                        Promise.all(promises).then((res) => {
                            res.forEach((r) => {
                                linesDeparture.push(r);
                            })
                            wholeObject.linesDeparture = linesDeparture;
                            var linePromises = [];
                            for(let j = 0 ; j<wholeObject.linesDeparture.length ; j++){
                                let idLine = wholeObject.linesDeparture[j].line;
                                linePromises.push(getStationsDepartureAndTerminalFromLine(idLine).then((station) => {
                                    wholeObject.linesDeparture[j].dep = station.dep;
                                    wholeObject.linesDeparture[j].ter = station.ter;                                    
                                }));
                            }
                            Promise.all(linePromises).then(() => {
                                resolve(wholeObject);                                
                            })
                        })
                    })
                }
            })
        })
    })
}

var getTripStationsName = function(idZone){
    return new Promise((resolve, reject) => {
        getAllInformationsWeNeedForReservations(idZone).then((wholeObject) => {
            var promises = [];
            for(let k = 0; k<wholeObject.linesDeparture.length ; k++){
                let trip = wholeObject.linesDeparture[k].trip;
                promises.push(dbStation.getDepartureAndTerminalStationWithIdLine(trip.from, trip.to).then((station) => {
                    trip.dep = station.dep;
                    trip.ter = station.ter;
                    trip = wholeObject.linesDeparture[k].trip;
                }));
            }
            Promise.all(promises).then(() => {
                resolve(wholeObject);
            })
        })
    })
}

var getStationsDepartureAndTerminalFromLine = function(idLine){
    return new Promise((resolve, reject)=> {
        dbLine.getLineById(idLine).then((line) => {
            dbStation.getDepartureAndTerminalStationWithIdLine(line.DepartureId, line.ArrivalId).then((station) => {
                resolve(station);
            })
        })
    })
}

exports.getTripStationsName = getTripStationsName;
exports.getAllInformationsWeNeedForReservations = getAllInformationsWeNeedForReservations;
exports.getAllBookDetails = getAllBookDetails;
exports.showReservationsForOneZone = showReservationsForOneZone;
exports.showAllZonesForReservations = showAllZonesForReservations;