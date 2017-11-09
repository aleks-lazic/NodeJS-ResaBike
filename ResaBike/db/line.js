var dbZone = require('./zone');
var dbStation = require('./station');
var models = require('../models');

/**
 * insert a new line
 * @param {*} lineNumber 
 * @param {*} idDeparture 
 * @param {*} idTerminal 
 * @param {*} idZone 
 */
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

/**
 * get line number by id line
 * @param {*} lineNumber 
 */
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

/**
 * delete a line by id
 * @param {*} idLine 
 */
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

/**
 * get a line by id
 * @param {*} idLine 
 */
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

/**
 * get all lines by zone id
 * @param {*} zoneId 
 */
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

//get the zone id by idline
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