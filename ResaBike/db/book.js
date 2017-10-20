var dbStation = require('./station');
var dbLine = require('./line');
var models = require('../models');

var insertReservation = function(time, token, nbBike, stationDeparture, stationTerminal, email){
    return new Promise((resolve, reject)=>{

        models.Book.create({
            time: time,
            token: token,
            nbBike: nbBike,
            DepartureId: stationDeparture,
            ArrivalId: stationTerminal,
            mail: email
        }).then(() =>{
            resolve();
        }).catch((err) =>{
            reject(err.message);
        });

    })
}

exports.insertReservation = insertReservation ;