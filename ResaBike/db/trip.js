var models = require('../models');

var insertTrip = function(departureHour, idLine, idBooking, idDeparture, idTerminal){
    return new Promise((resolve, reject)=>{
        models.Trip.create({
            departureHour: departureHour,
            idLine: idLine,
            idBooking: idBooking,
            idDeparture: idTerminal,
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

exports.getAllTripsByIdBooking = getAllTripsByIdBooking;
exports.insertTrip = insertTrip;
exports.getAllReservationsByDepartureAndLine = getAllReservationsByDepartureAndLine;
