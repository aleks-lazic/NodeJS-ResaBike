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

exports.deleteReservationByToken = deleteReservationByToken ;
exports.insertReservation = insertReservation ;