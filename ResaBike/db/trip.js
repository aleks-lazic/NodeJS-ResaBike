var models = require('../models');

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

exports.deleteTrip = deleteTrip;
exports.getAllTripsByIdBooking2 = getAllTripsByIdBooking2;
exports.getAllTripsByIdBooking = getAllTripsByIdBooking;
exports.insertTrip = insertTrip;
exports.getAllReservationsByDepartureAndLine = getAllReservationsByDepartureAndLine;
