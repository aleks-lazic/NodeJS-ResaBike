var models = require('../models');

var getAllStations = function(){
    return new Promise((resolve, reject)=>{
        models.Station.findAll({
        }).then(stations =>{
            resolve(stations);
            //console.log(stations);
        }).catch((err)=>{
            reject(err.message);
        })
    })
}

var getStationIdByName = function(name){
    return new Promise((resolve, reject) =>{
        models.Station.findOne({
            where: {
                name: name
            }
        }).then((res)=>{
            resolve(res.id);
        }).catch((err)=>{
            reject(err.message);
        });
    })
}

var insertStation = function(stationName){
    models.Station.create({
        name: stationName,
    }).then(() =>{
        console.log('Station added : ' + stationName);
    }).catch((err) =>{
        reject(err.message);
    });
}

var upsertStation = function(idStation, stationName){
    return new Promise((resolve, reject) => {
        models.Station.upsert({
           id: idStation,
           name: stationName 
        }).then(()=> {
            resolve();
        }).catch((err)=> {
            reject(err.message);
        });
    })
}

exports.getAllStations = getAllStations;
exports.getStationIdByName = getStationIdByName;
exports.insertStation = insertStation;
exports.upsertStation = upsertStation;