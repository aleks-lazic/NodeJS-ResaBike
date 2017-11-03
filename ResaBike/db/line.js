var dbZone = require('./zone');
var dbStation = require('./station');
var models = require('../models');


var insertLine = function(lineNumber, idDeparture, idTerminal, idZone){
    return new Promise((resolve, reject) => {
        models.Line.create({
            id: lineNumber,
            DepartureId: idDeparture,
            ArrivalId: idTerminal,
            ZoneId: idZone
        }).then(() =>{
            resolve(lineNumber);
        }).catch((err) =>{
            console.log(err.message);
        });
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

var getLineById = function(idLine) {
    return new Promise((resolve, reject) => {
        models.Line.findOne({
            where: {
                id: idLine
            }
        }).then((res)=>{
            resolve(res);
        }).catch((err)=>{
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

var getZoneIdByLine = function(idLine){
    return new Promise((resolve, reject) =>{
        models.Line.findOne({
            where: {
                id: idLine
            }
        }).then((res)=> {
            resolve(res.ZoneId);
        }).catch((err) =>{
            reject(err.message);
        });
    }) 
}

exports.getLineById = getLineById;
exports.getZoneIdByLine = getZoneIdByLine;
exports.getLinesByIdZone = getLinesByIdZone;
exports.insertLine = insertLine;
exports.getLineIdByLineNumber = getLineIdByLineNumber;
exports.deleteLineById = deleteLineById;