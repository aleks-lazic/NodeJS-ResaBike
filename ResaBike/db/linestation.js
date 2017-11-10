var models = require('../models');

/**
 * insert new station id and line id
 * @param {*} stationId 
 * @param {*} lineId 
 * @param {*} position 
 * @param {*} isDepOrTer 
 */
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
            reject();
        });
    })
}

/**
 * delete line id with id line
 * @param {*} idLine 
 */
var deleteLineIdFromLineStation = function(idLine){
    return new Promise((resolve, reject) => {
        models.LineStation.destroy({
            where:{
                LineId: idLine
            }
        }).then(() => {
            resolve();
        }).catch((err)=> {
            reject(err.message);
        });
    })
}

/**
 * get all stations with id line
 * @param {*} idLine 
 */
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

/**
 * get station name with id station
 * @param {*} idStation 
 */
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