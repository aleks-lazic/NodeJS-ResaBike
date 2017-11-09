var models = require('../models');
/**
 * Innsert a trip using its departure hour, its line, its booking id, its departure and its terminal
 * @param {*} departureHour 
 * @param {*} idLine 
 * @param {*} idBooking 
 * @param {*} idDeparture 
 * @param {*} idTerminal 
 */
var insertTrip = function(departureHour, idLine, idBooking, idDeparture, idTerminal){
    return new Promise((resolve, reject)=>{
        models.Trip.create({
            departureHour: departureHour,
            idLine: idLine,
            idBooking: idBooking,
            idDeparture: idDeparture,
            idTerminal: idTerminal
        }).then((trip) =>{
            resolve(trip.id);
        }).catch((err) =>{
            reject(err.message);
        });
    })
}
/**
 * Retrieve all reservations using departure and the line
 * @param {*} departureHour 
 * @param {*} idLine 
 */
var getAllReservationsByDepartureAndLine = function(departureHour, idLine){
    return new Promise((resolve, reject) => {
        models.Trip.findAll({
            where:{
                departureHour: departureHour,
                idLine: idLine
            }
        }).then(trips =>{
            resolve(trips);
        }).catch((err)=>{
            reject(err.message);
        })
    })
}
/**
 * Retrieve all trips using its booking id
 * @param {*} idBooking 
 */
var getAllTripsByIdBooking = function(idBooking){
    return new Promise((resolve, reject) =>{
        models.Trip.findAll({
            where: {
                idBooking: idBooking
            }
        }).then((trips)=>{
            resolve(trips);
        }).catch((err)=>{
            reject(err.message);
        });
    })
}
/**
 * Retrieve all trips from the database
 */
var getAllTrips = function(){
    return new Promise((resolve, reject) =>{
        models.Trip.findAll({
        }).then((trips)=>{
            resolve(trips);
        }).catch((err)=>{
            reject(err.message);
        });
    })
}
/**
 * Retrieve all trips using its id booking. Retrieve all informations about trips
 * @param {*} idBooking 
 * @param {*} nbBike 
 * @param {*} firstname 
 * @param {*} lastname 
 * @param {*} mail 
 * @param {*} idBook 
 * @param {*} isConfirmed 
 */
var getAllTripsByIdBooking2 = function(idBooking, nbBike, firstname, lastname, mail, idBook, isConfirmed){
    return new Promise((resolve, reject) =>{
        models.Trip.findAll({
            where: {
                idBooking: idBooking
            }
        }).then((trips)=>{
            var tripsObject ={
                nbBike: nbBike,
                firstname: firstname,
                lastname: lastname,
                mail: mail,
                idBook: idBook,
                isConfirmed: isConfirmed,
                trips: trips
            };
            resolve(tripsObject);
        }).catch((err)=>{
            reject(err.message);
        });
    })
}
/**
 * Delete trip using its booking id linked to it
 * @param {*} idBook 
 */
var deleteTrip = function(idBook){
    return new Promise((resolve, reject) => {
        models.Trip.destroy({
            where:{
                idBooking: idBook
            }
        }).then(() => {                  
            resolve();
        }).catch((err)=> {
            reject(err.message);
        });
    })
}

var deleteTripByLine = function(idLine){
    return new Promise((resolve, reject) => {
        models.Trip.destroy({
            where:{
                idLine: idLine
            }
        }).then(() => {                  
            resolve();
        }).catch((err)=> {
            reject(err.message);
        });
    })
}

exports.deleteTripByLine = deleteTripByLine;
exports.deleteTrip = deleteTrip;
exports.getAllTripsByIdBooking2 = getAllTripsByIdBooking2;
exports.getAllTripsByIdBooking = getAllTripsByIdBooking;
exports.insertTrip = insertTrip;
exports.getAllReservationsByDepartureAndLine = getAllReservationsByDepartureAndLine;
