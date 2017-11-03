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

var getAllTripsByIdBooking2 = function(idBooking, nbBike){
    return new Promise((resolve, reject) =>{
        models.Trip.findAll({
            where: {
                idBooking: idBooking
            }
        }).then((trips)=>{
            var tripsObject ={
                nbBike: nbBike,
                trips: trips
            };
            resolve(tripsObject);
        }).catch((err)=>{
            reject(err.message);
        });
    })
}

exports.getAllTripsByIdBooking2 = getAllTripsByIdBooking2;
exports.getAllTripsByIdBooking = getAllTripsByIdBooking;
exports.insertTrip = insertTrip;
exports.getAllReservationsByDepartureAndLine = getAllReservationsByDepartureAndLine;
