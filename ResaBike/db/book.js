var dbStation = require('./station');
var dbLine = require('./line');
var dbTrip = require('./trip');
var models = require('../models');

var insertReservation = function(time, token, nbBike, stationDeparture, stationTerminal, email, isConfirmed){
    return new Promise((resolve, reject)=>{
        models.Book.create({
            time: time,
            token: token,
            nbBike: nbBike,
            DepartureId: stationDeparture,
            ArrivalId: stationTerminal,
            mail: email,
            isConfirmed: isConfirmed
        }).then((book) =>{
            resolve(book.id);
        }).catch((err) =>{
            reject(err.message);
        });
    })
}

var deleteReservationByToken = function(token){
    return new Promise((resolve, reject) => {
        models.Book.destroy({
            where:{
                token: token
            }
        }).then(() => {                  
            resolve();
        }).catch((err)=> {
            reject(err.message);
        });
    })
}

var getNbBikesByReservation = function(idBooking){
    return new Promise((resolve, reject)=>{
        models.Book.findOne({
            where:{
                id: idBooking,
                isConfirmed: 1
            }
        }).then(book =>{
            if(book != null){
                resolve(book.nbBike);                
            } else {
                resolve(0);
            }
        }).catch((err)=>{
            reject(err.message);
        })
    })
}

var getSumBikesByLineAndDepartureHour = function(departureHour, idLine){
    return new Promise((resolve, reject) => {
        dbTrip.getAllReservationsByDepartureAndLine(departureHour, idLine).then((trips) => {
            var nbBikesBooked = 0;
            var promises = [];
            trips.forEach(function(t) {
              promises.push(getNbBikesByReservation(t.idBooking).then((nbBikes)=>{
                nbBikesBooked += nbBikes;
              }));  
            }, this);
            Promise.all(promises).then(()=> {
                resolve(nbBikesBooked);
            })
        })
    })
}

var getSumWithMultipleLines = function(departureHour, idLines){
    return new Promise((resolve, reject) => {
        var promises = [];
        for(let k = 0 ; k<idLines.length ; k++){
            promises.push(getSumBikesByLineAndDepartureHour(departureHour, idLines[k]));        
        }
        Promise.all(promises).then((results) => {
            for(let x = 0 ; x<results.length ; x++){
                console.log(results[x]);
            }
            var max = Math.max.apply(Math, results);
            resolve(max);
        })
    })
}

var getAllReservationsNotConfirmed = function(){
    return new Promise((resolve, reject) => {
        models.Book.findAll({
            where:{
                isConfirmed: false
            }
        }).then(books =>{
            resolve(books);
        }).catch((err)=>{
            reject(err.message);
        })
    });
}

exports.getAllReservationsNotConfirmed = getAllReservationsNotConfirmed;
exports.getSumWithMultipleLines = getSumWithMultipleLines;
exports.getSumBikesByLineAndDepartureHour = getSumBikesByLineAndDepartureHour;
exports.deleteReservationByToken = deleteReservationByToken ;
exports.insertReservation = insertReservation ;