var models = require('../models');

var getAllStations = function(){
    return new Promise((resolve, reject)=>{
        models.Station.findAll({
        }).then(stations =>{
           console.log(JSON.stringify(stations));
        }).catch((err)=>{
          console.log('Error : ' + err.message);
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
            console.log("Id : " + res.id);
            resolve(res.id);
        }).catch((err)=>{
            console.log("Error : " + err.message);
        });
    })
}

var insertStation = function(stationName){
    return new Promise((resolve, reject) =>{
        models.Station.create({
            name: stationName,
        }).then(() =>{
            console.log('Station added : ' + stationName);
        }).catch((err) =>{
            console.log(err.message);
        });
    })
}


exports.getAllStations = getAllStations;
exports.getStationIdByName = getStationIdByName;
exports.insertStation = insertStation;