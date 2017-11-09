var dbZone = require('../db/zone');
var dbBook = require('../db/book');
var dbTrip = require('../db/trip');
var dbLine = require('../db/line');
var dbZone = require('../db/zone');
var dbStation = require('../db/station');
var email = require('../modules/email');

var showAllZonesForReservations = function(){
    return new Promise((resolve, reject) => {
        //first get all zones
        dbZone.getAllZones().then((zones) => {
            //get all reservations
            dbBook.getAllReservations().then((books) => {
                console.log(books);                
                if(books.length == 0){
                    console.log("BOOOOOKS" + books);
                    for(let k = 0 ; k<zones.length ; k++){
                        zones[k].books = [];                            
                    }
                    console.log(zones);
                    resolve(zones);
                    return;
                }
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

var sortDataToRemoveDuplicatedLinesHours = function(idZone){
    return new Promise((resolve, reject) => {
        getTripStationsName(idZone).then((wholeObject) => {
            var linesDeparture = [];
            for(let k = 0 ; k<wholeObject.linesDeparture.length ; k++){
                let currentLineDeparture = wholeObject.linesDeparture[k];
                if(linesDeparture.length == 0){
                    linesDeparture.push(currentLineDeparture);
                }
                for(let i = 0 ; i<linesDeparture.length ; i++){
                    var flag = false;
                    if((linesDeparture[i].line == currentLineDeparture.line) && 
                        (linesDeparture [i].dateTime == currentLineDeparture.dateTime)){
                            flag = true;
                    }
                    if(flag){
                        break;
                    }
                }
                if(!flag){
                    linesDeparture.push(currentLineDeparture);                
                }
            }
            wholeObject.linesDeparture = linesDeparture;
            resolve(wholeObject);
        })
    })
}

var addTripsToCorrectLineHours = function(idZone){
    return new Promise((resolve, reject) => {
        sortDataToRemoveDuplicatedLinesHours(idZone).then((wholeObject) => {
            //récupérer toutes les réservations
            dbBook.getAllReservations().then((books) => {
                var promisesTrips = [];
                books.forEach((b) => {
                    let nbBike = b.nbBike;
                    let firstname = b.firstname;
                    let lastname = b.lastname;
                    let mail = b.mail;
                    let idBook = b.id;
                    let isConfirmed = b.isConfirmed;
                    //récupérer tous les trips pour chaque réservation
                    promisesTrips.push(dbTrip.getAllTripsByIdBooking2(b.id, nbBike, firstname, lastname, mail, idBook, isConfirmed));
                })
                //une fois qu'on a tous les trips pour chaque réservation
                Promise.all(promisesTrips).then((allTrips) => {
                    //pour chaque trip il faut la mettre dans le bon objet
                    var promisesTrip = [];
                    allTrips.forEach((tripObject) => {
                        promisesTrip.push(new Promise((resolve, reject) => {
                            for(let l = 0; l<tripObject.trips.length ; l++){
                                let currentTrip = tripObject.trips[l];
                                for(let k = 0 ; k<wholeObject.linesDeparture.length ; k++){
                                    let currentLineDeparture = wholeObject.linesDeparture[k];
                                    if((currentTrip.idLine == currentLineDeparture.line) && (currentTrip.departureHour == currentLineDeparture.dateTime)){
                                        if(wholeObject.linesDeparture[k].trips == null){
                                            wholeObject.linesDeparture[k].trips = [];
                                            var trip = {
                                                id: currentTrip.id,
                                                dep: wholeObject.linesDeparture[k].trip.dep,
                                                ter: wholeObject.linesDeparture[k].trip.ter,
                                                nbBike: tripObject.nbBike,
                                                idBook : tripObject.idBook,
                                                isConfirmed: tripObject.isConfirmed,
                                                firstname: tripObject.firstname,
                                                lastname: tripObject.lastname,
                                                mail: tripObject.mail
                                            };
                                            wholeObject.linesDeparture[k].trips.push(trip);
                                        } else {
                                            var trip = {
                                                id: currentTrip.id,
                                                dep: wholeObject.linesDeparture[k].trip.dep,
                                                ter: wholeObject.linesDeparture[k].trip.ter,
                                                nbBike: tripObject.nbBike,
                                                idBook : tripObject.idBook,
                                                isConfirmed: tripObject.isConfirmed,
                                                firstname: tripObject.firstname,
                                                lastname: tripObject.lastname,
                                                mail: tripObject.mail
                                            };
                                            wholeObject.linesDeparture[k].trips.push(trip);
                                        }
                                    }
                                }
                            }
                            resolve();
                        }))
                    })
                    Promise.all(promisesTrip).then(() => {
                        for(let k = 0 ; k<wholeObject.linesDeparture.length ; k++){
                            var totalBikeReserved = 0;
                            var totalBikeToConfirm = 0;
                            for(let i = 0 ; i<wholeObject.linesDeparture[k].trips.length ; i++){
                                if(wholeObject.linesDeparture[k].trips[i].isConfirmed == true)
                                    totalBikeReserved += wholeObject.linesDeparture[k].trips[i].nbBike;
                                else
                                    totalBikeToConfirm += wholeObject.linesDeparture[k].trips[i].nbBike;
                            }
                            wholeObject.linesDeparture[k].totalBikeReserved = totalBikeReserved;
                            wholeObject.linesDeparture[k].totalBikeToConfirm = totalBikeToConfirm;                            
                        }
                        resolve(wholeObject);
                    })
                })
            })
        })
    })
}

var deleteReservation = function(idBook){
    return new Promise((resolve, reject) => {
        //get the book we want to delete
        dbBook.getReservationById(idBook).then((book) => {
            //create the object for the mail
            var objectMail = {
                firstname: book.firstname,
                lastname: book.lastname,
                from: book.DepartureId,
                to: book.ArrivalId,
                time: book.time,
                mail: book.mail,
                nBbike: book.nbBike
            }

            var promises = [];
            //delete the trips
            promises.push(dbTrip.deleteTrip(idBook));
            //delete the book
            promises.push(dbBook.deleteReservation(idBook));

            Promise.all(promises).then(() => {
                //send the mail
                sendRefusalMail(objectMail);
                resolve();
            })  
        })
    })
}

var sendRefusalMail = function(objectMail){
    //get departureStation and Arrival
    var promises = [];
    promises.push(dbStation.getStationById(objectMail.from));
    promises.push(dbStation.getStationById(objectMail.to));

    Promise.all(promises).then((stations) => {
        //mail subject
        let mailSubject = 'Reservation not confirmed - Resabike';

        let mailContent = `<div>
                                <h1>Reservation not confirmed</h1>
                            </div>
                            <div>
                                <p>Date : ${objectMail.time}
                                <br>Departure From : ${stations[0].name}
                                <br>To : ${stations[1].name}
                                <br>Numbers of bike : ${objectMail.nbBike}</p>
                            </div>       
                            <br>`;

        email.createEmail(objectMail.mail, mailSubject, mailContent);
    })
}

var confirmReservation = function(idBook){
    return new Promise((resolve, reject) => {
        //get the book we want to delete
        dbBook.getReservationById(idBook).then((book) => {
            //create the object for the mail
            var objectMail = {
                firstname: book.firstname,
                lastname: book.lastname,
                from: book.DepartureId,
                to: book.ArrivalId,
                time: book.time,
                mail: book.mail,
                nBbike: book.nbBike,
                token: book.token
            };
            //modify the booking to confirmed
            dbBook.confirmReservation(idBook).then(() => {
                //send confirm email
                sendConfirmMail(objectMail);
                resolve();
            })
        })
    })
}

var sendConfirmMail = function(objectMail){
    console.log('jenvoie le mail de confirmation')
    //get departureStation and Arrival
    var promises = [];
    promises.push(dbStation.getStationById(objectMail.from));
    promises.push(dbStation.getStationById(objectMail.to));

    Promise.all(promises).then((stations) => {
        //mail subject
        let mailSubject = 'Reservation confirmed - Resabike';
        let urlToDelete = 'http://localhost:3000/book/delete/' + objectMail.token
        let mailContent = `<div>
                                <h1>Reservation Confirmation</h1>
                            </div>
                            <div>
                                <p>Date : ${objectMail.time}
                                <br>Departure From : ${stations[0].name}
                                <br>To : ${stations[1].name}
                                <br>Numbers of bike : ${objectMail.nbBike}</p>
                            </div>       
                            <br>
                            <div>
                            <p>If you want to delete the reservation, you juste have to press this link : <a href="${urlToDelete}">Delete confirmation</a></p>
                            </div>` ;

        email.createEmail(objectMail.mail, mailSubject, mailContent);
    })
}

var sortDataToGetHistorical = function(wholeObject){
    return new Promise((resolve, reject) => {
        var currentDate = new Date();
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        currentDate = new Date(year+ '/' + month + '/' + day);
        var newLineDeparture = [];
        for(let i = wholeObject.linesDeparture.length - 1 ; i>= 0 ; i--){
            var departureDate = new Date(wholeObject.linesDeparture[i].dateTime.split(' ')[0]);
            if(departureDate < currentDate){
                newLineDeparture.push(wholeObject.linesDeparture[i])
            }
        }
        wholeObject.linesDeparture = newLineDeparture;
        resolve(wholeObject);    })
}

var sortDataToGetReservationsToCome = function(wholeObject){
    return new Promise((resolve, reject) => {
        var currentDate = new Date();
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        currentDate = new Date(year+ '/' + month + '/' + day);
        var newLineDeparture = [];
        for(let i = wholeObject.linesDeparture.length - 1 ; i>= 0 ; i--){
            var departureDate = new Date(wholeObject.linesDeparture[i].dateTime.split(' ')[0]);
            if(departureDate >= currentDate){
                newLineDeparture.push(wholeObject.linesDeparture[i])
            }
        }
        wholeObject.linesDeparture = newLineDeparture;
        resolve(wholeObject);
    })
}

exports.sortDataToGetReservationsToCome = sortDataToGetReservationsToCome;
exports.sortDataToGetHistorical = sortDataToGetHistorical;
exports.confirmReservation = confirmReservation;
exports.deleteReservation = deleteReservation;
exports.addTripsToCorrectLineHours = addTripsToCorrectLineHours;
exports.sortDataToRemoveDuplicatedLinesHours = sortDataToRemoveDuplicatedLinesHours;
exports.getTripStationsName = getTripStationsName;
exports.getAllInformationsWeNeedForReservations = getAllInformationsWeNeedForReservations;
exports.getAllBookDetails = getAllBookDetails;
exports.showReservationsForOneZone = showReservationsForOneZone;
exports.showAllZonesForReservations = showAllZonesForReservations;