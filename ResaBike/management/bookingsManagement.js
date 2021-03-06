var dbZone = require('../db/zone');
var dbBook = require('../db/book');
var dbTrip = require('../db/trip');
var dbLine = require('../db/line');
var dbZone = require('../db/zone');
var dbStation = require('../db/station');
var email = require('../modules/email');

/**
 * show all zones with all reservations
 */
var showAllZonesForReservations = function(){
    return new Promise((resolve, reject) => {
        //first get all zones
        dbZone.getAllZones().then((zones) => {
            //get all reservations
            dbBook.getAllReservations().then((books) => {
                if(books.length == 0){
                    for(let k = 0 ; k<zones.length ; k++){
                        zones[k].books = [];                            
                    }
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

/**
 * get all trips for each reservation
 * @param {*} book 
 */
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

/**
 * show the reservations for one zone with idZone
 * @param {*} idZone 
 */
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

/**
 * get all book details with idZone
 * @param {*} idZone 
 */
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

/**
 * assign a trip to a line and hour
 * @param {*} trip 
 * @param {*} nbBikes 
 */
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

/**
 * get all informations we need for reservations
 * @param {*} idZone 
 */
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

/**
 * get trip stations name
 * @param {*} idZone 
 */
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

/**
 * get stations departure and terminal from line
 * @param {*} idLine 
 */
var getStationsDepartureAndTerminalFromLine = function(idLine){
    return new Promise((resolve, reject)=> {
        dbLine.getLineById(idLine).then((line) => {
            dbStation.getDepartureAndTerminalStationWithIdLine(line.DepartureId, line.ArrivalId).then((station) => {
                resolve(station);
            })
        })
    })
}

/**
 * sort data to remove duplicated lines hours
 * @param {*} idZone 
 */
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

/**
 * add trips to correct line HOURS
 * @param {*} idZone 
 */
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

/**
 * delete a reservation when the zone admin deletes it
 * @param {*} idBook 
 * @param {*} res 
 */
var deleteReservation = function(idBook, res){
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
                sendRefusalMail(objectMail, res);
                resolve();
            })  
        })
    })
}

/**
 * send the refusal mail if the admin has canceled it
 * @param {*} objectMail 
 * @param {*} res 
 */
var sendRefusalMail = function(objectMail, res){
    //get departureStation and Arrival
    var promises = [];
    promises.push(dbStation.getStationById(objectMail.from));
    promises.push(dbStation.getStationById(objectMail.to));

    Promise.all(promises).then((stations) => {
        //mail subject
        let mailSubject = res.locals.lang.mailBmRefSubject ;

        let mailContent = res.locals.lang.mailBmFirstPart + objectMail.time +
                          res.locals.lang.mailBmSec1Part + stations[0].name +
                          res.locals.lang.mailBmSec2Part + stations[1].name + 
                          res.locals.lang.mailBmSec3Part + objectMail.nBbike + 
                          res.locals.lang.mailBmLastPart ;

        email.createEmail(objectMail.mail, mailSubject, mailContent);
    })
}

/**
 * confirm reservation if the admin has accepted it
 * @param {*} idBook 
 * @param {*} res 
 */
var confirmReservation = function(idBook, res){
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
            console.log(objectMail);
            //modify the booking to confirmed
            dbBook.confirmReservation(idBook).then(() => {
                //send confirm email
                sendConfirmMail(objectMail, res);
                resolve();
            })
        })
    })
}

/**
 * send confirm mail if the admin has accepted it
 * @param {*} objectMail 
 * @param {*} res 
 */
var sendConfirmMail = function(objectMail, res){
    console.log('jenvoie le mail de confirmation')
    //get departureStation and Arrival
    var promises = [];
    promises.push(dbStation.getStationById(objectMail.from));
    promises.push(dbStation.getStationById(objectMail.to));

    Promise.all(promises).then((stations) => {
        //mail subject
        let mailSubject = res.locals.lang.mailResSubject ;
        //CHANGE URL WHEN DEPLOY
        let urlToDelete = 'http://localhost:3000/' + res.locals.langUsed + '/book/delete/' + objectMail.token
        let mailContent = res.locals.lang.mailResFirstPart + objectMail.time +
                          res.locals.lang.mailResSec1Part + stations[0].name + 
                          res.locals.lang.mailResSec2Part + stations[1].name + 
                          res.locals.lang.mailResSec3Part + objectMail.nBbike + 
                          res.locals.lang.mailResDel1Part + urlToDelete + res.locals.lang.mailResDel2Part ;

        email.createEmail(objectMail.mail, mailSubject, mailContent);
    })
}

/**
 * sort data to get only the historical (all reservations before today)
 * @param {*} wholeObject 
 */
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

/**
 * sort data to get only the upcoming reservations
 * @param {*} wholeObject 
 */
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