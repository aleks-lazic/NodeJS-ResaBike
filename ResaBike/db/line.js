var dbZone = require('./zone');
var dbStation = require('./station');
var models = require('../models');


var insertLine = function(lineNumber, stationDeparture, stationTerminal, idZone){
    return new Promise((resolve, reject) => {
        //get the id of station departure
        let idDeparture = dbStation.getStationIdByName(stationDeparture);
        //get the id of station terminal
        let idTerminal = dbStation.getStationIdByName(stationTerminal);
        
        Promise.all([idDeparture, idTerminal])
        .then((res)=>{
            models.Line.upsert({
                id: lineNumber,
                DepartureId: res[0],
                ArrivalId: res[1],
                ZoneId: idZone
            }).then(() =>{
                console.log('Line '+lineNumber+' added');
                resolve(lineNumber);
            }).catch((err) =>{
                console.log(err.message);
            });
        })
    })          
}

var getLineIdByLineNumber = function(lineNumber){
    return new Promise((resolve, reject) => {
        models.Line.findOne({
            where: {
                number: lineNumber
            }
        }).then((res)=>{
            resolve(res.id);
        }).catch((err)=>{
            reject(err.message);
        });
    })
}

var deleteLineById = function(idLine){
    return new Promise((resolve, reject) => {
        models.Line.destroy({
            where:{
                id: idLine
            }
        }).then(() => {
            console.log("JE SUPPRIME LA LINE");                        
            resolve();
        }).catch((err)=> {
            reject(err.message);
        });
    })
}


var getLinesByIdZone = function(zoneId){
    return new Promise((resolve, reject) =>{
        models.Line.findAll({
            where: {
                ZoneId: zoneId
            }
        }).then((res)=> {
            resolve(res);
        }).catch((err) =>{
            reject(err.message);
        });
    })
}
exports.getLinesByIdZone = getLinesByIdZone;
exports.insertLine = insertLine;
exports.getLineIdByLineNumber = getLineIdByLineNumber;
exports.deleteLineById = deleteLineById;