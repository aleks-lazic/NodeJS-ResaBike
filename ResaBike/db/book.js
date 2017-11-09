var dbStation = require('./station');
var dbLine = require('./line');
var dbTrip = require('./trip');
var models = require('../models');

/**
 * Insert a new reservation
 * @param {*} time 
 * @param {*} token 
 * @param {*} nbBike 
 * @param {*} stationDeparture 
 * @param {*} stationTerminal 
 * @param {*} email 
 * @param {*} isConfirmed 
 * @param {*} firstname 
 * @param {*} lastname 
 */
var insertReservation = function(time, token, nbBike, stationDeparture, stationTerminal, email, isConfirmed, firstname, lastname){
    return new Promise((resolve, reject)=>{
        models.Book.create({
            time: time,
            token: token,
            nbBike: nbBike,
            DepartureId: stationDeparture,
            ArrivalId: stationTerminal,
            mail: email,
            isConfirmed: isConfirmed,
            firstname: firstname,
            lastname: lastname
        }).then((book) =>{
            resolve(book.id);
        }).catch((err) =>{
            reject(err.message);
        });
    })
}

/**
 * Delete a reservation by token
 * @param {*} token 
 */
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

/**
 * Get the number of bikes booked by id reservation
 * @param {*} idBooking 
 */
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

/**
 * get the sum of bikes by line and departure hour
 * @param {*} departureHour 
 * @param {*} idLine 
 */
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

/**
 * get sum of bikes with array of idLines
 * @param {*} departureHour 
 * @param {*} idLines 
 */
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

/**
 * get all reservations that are not confirmed
 */
var getAllReservationsNotConfirmed = function(){
    return new Promise((resolve, reject) => {
        models.Book.findAll({
            where:{
                isConfirmed: false
            }
        }).then(books =>{
            if(books != null){
                resolve(books);
            } else {
                resolve([]);
            }
        }).catch((err)=>{
            reject(err.message);
        })
    });
}

/**
 * get all reservations
 */
var getAllReservations = function(){
    return new Promise((resolve, reject) => {
        models.Book.findAll({
        }).then(books =>{
            resolve(books);
        }).catch((err)=>{
            reject(err.message);
        })
    });
}

/**
 * delete a reservation
 * @param {*} idBook 
 */
var deleteReservation = function(idBook){
    return new Promise((resolve, reject) => {
        models.Book.destroy({
            where:{
                id: idBook
            }
        }).then(() => {                  
            resolve();
        }).catch((err)=> {
            reject(err.message);
        });
    })
}

/**
 * get a reservation by id
 * @param {*} idBook 
 */
var getReservationById = function(idBook){
    return new Promise((resolve, reject) => {
        models.Book.findOne({
            where:{
                id: idBook
            }
        }).then((book) => {                  
            resolve(book);
        }).catch((err)=> {
            reject(err.message);
        });
    })
}

/**
 * confirm a reservation with the id book
 * @param {*} idBook 
 */
var confirmReservation = function(idBook){
    return new Promise((resolve, reject) => {
        models.Book.update({
            isConfirmed: true
            },
            {where:{
                id: idBook
            }
        }).then(() => {
            resolve();
        }).catch((err) => {
            reject(err.message);
        });
    })
}

/**
 * get a reservation by token
 * @param {*} token 
 */
var getReservationByToken = function(token) {
    return new Promise((resolve, reject) => {
        models.Book.findOne({
            where:{
                token: token
            }
        }).then((book) => {                  
            resolve(book);
        }).catch((err)=> {
            reject(err.message);
        });
    })
}

exports.getReservationByToken = getReservationByToken;
exports.confirmReservation = confirmReservation;
exports.getReservationById = getReservationById;
exports.deleteReservation = deleteReservation;
exports.getAllReservations = getAllReservations;
exports.getAllReservationsNotConfirmed = getAllReservationsNotConfirmed;
exports.getSumWithMultipleLines = getSumWithMultipleLines;
exports.getSumBikesByLineAndDepartureHour = getSumBikesByLineAndDepartureHour;
exports.deleteReservationByToken = deleteReservationByToken ;
exports.insertReservation = insertReservation ;