var models = require('../models');

var insertStationIdAndLineId = function(stationId, lineId, position, isDepOrTer){
    return new Promise((resolve, reject) => {
        models.LineStation.upsert({
            LineId: lineId,
            StationId: stationId,
            position: position, 
            isDepOrTer: isDepOrTer
        }).then(() =>{
            console.log('Relation between station and line added');
            resolve();  
        }).catch((err) =>{
            console.log(err.message);
        });
    })
}

var deleteLineIdFromLineStation = function(idLine){
    return new Promise((resolve, reject) => {
        models.LineStation.destroy({
            where:{
                LineId: idLine
            }
        }).then(() => {
            console.log("JE SUPPRIME LA LINESTATION");       
            resolve();
        }).catch((err)=> {
            reject(err.message);
        });
    })
}

var getAllStationsWithIdLine = function(idLine){
    return new Promise((resolve, reject) => {
        models.LineStation.findAll({
            where: {
                LineId: idLine
            },
            attributes: ['position', 'StationId']
        }).then((res)=> {
            resolve(res);
        }).catch((err) => {
            reject(err.message);
        });
    })
}

var getStationWithIdStation = function(idStation){
    return new Promise((resolve, reject) => {
        models.LineStation.findAll({
           where:{
               StationId: idStation
           } 
        }).then((lineStation) => {
            resolve(lineStation);
        }).catch(() => {
            reject(false);
        })
    })
}

exports.getStationWithIdStation = getStationWithIdStation;
exports.deleteLineIdFromLineStation = deleteLineIdFromLineStation;
exports.insertStationIdAndLineId = insertStationIdAndLineId;
exports.getAllStationsWithIdLine = getAllStationsWithIdLine;