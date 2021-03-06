var models = require('../models');
var dbLineStation = require('./linestation');
var dbLine = require('../db/line');

/**
 * get all stations
 */
var getAllStations = function(){
    return new Promise((resolve, reject)=>{
        models.Station.findAll({
        }).then(stations =>{
            resolve(stations);
        }).catch((err)=>{
            reject(err.message);
        })
    })
}

/**
 * get station id by name
 * @param {*} name 
 */
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

/**
 * get station by id
 * @param {*} id 
 */
var getStationById = function(id){
    return new Promise((resolve, reject) =>{
        models.Station.findOne({
            where: {
                id: id
            }
        }).then((res)=>{
            resolve(res);
        }).catch((err)=>{
            reject(err.message);
        });
    })
}

/**
 * insert new station with station name
 * @param {*} stationName 
 */
var insertStation = function(stationName){
    models.Station.create({
        name: stationName,
    }).then(() =>{
        console.log('Station added : ' + stationName);
    }).catch((err) =>{
        reject(err.message);
    });
}

/**
 * upsert a new station (create if not exists)
 * @param {*} idStation 
 * @param {*} stationName 
 */
var upsertStation = function(idStation, stationName){
    return new Promise((resolve, reject) => {
        models.Station.upsert({
           id: idStation,
           name: stationName 
        }).then(()=> {
            resolve(idStation);
        }).catch((err)=> {
            reject(err.message);
        });
    })
}

//GET ALL STATIONS WITH WITH LIST OF IDSTATIONS (NOT USED NOW)
var getAllStationsById = function(idStationsList){
    return new Promise((resolve, reject) => {
        var stations = [];
        var promises = [];
        for(let i = 0 ; i<idStationsList.length ; i++){
            promises.push(getStationById(idStationsList[i].StationId));
        }
    
        Promise.all(promises).then((res) => {
            for(let k = 0 ; k<idStationsList.length ; k++){
                stations.push(res[k]);
            }
            resolve(stations);
        })
    })
}

//GET ALL STATIONS WITH LINE ID (NOT USED NOW)
var getAllStationsWithLineId = function(idLine){
    return new Promise((resolve, reject) => {
        dbLineStation.getAllStationsWithIdLine(idLine).then((idStationsList) => {
            resolve(getAllStationsById(idStationsList));
        })
    })
}

/**
 * get departure and terminal station with id line
 * @param {*} idDep 
 * @param {*} idTer 
 */
var getDepartureAndTerminalStationWithIdLine = function(idDep, idTer) {
    return new Promise((resolve, reject) => {
        var station = {
            dep: "",
            ter: ""
        };
        var promises = [];

        promises.push(getStationById(idDep));
        promises.push(getStationById(idTer));

        Promise.all(promises).then((res) => {
            station.dep = res[0].name;
            station.ter = res[1].name;

            resolve(station);
        })
    })
}

/**
 * delete a station
 * @param {*} idStation 
 */
var deleteStation = function(idStation) {
    return new Promise((resolve, reject) => {
        //first check if the station still exists in the linestation
        dbLineStation.getStationWithIdStation(idStation).then((success) => {
            //if length > 0 we dont need to delete the station
            // else we dont need the station anymore
            if(success.length > 0) {
                resolve();
            } else {
                models.Station.destroy({
                    where:{
                        id: idStation
                    }
                }).then(() => {
                    resolve();
                }).catch((err)=> {
                    reject(err.message);
                });            
            }
        })
    })
}

exports.deleteStation = deleteStation;
exports.getAllStations = getAllStations;
exports.getStationIdByName = getStationIdByName;
exports.insertStation = insertStation;
exports.upsertStation = upsertStation;
exports.getAllStationsWithLineId = getAllStationsWithLineId;
exports.getStationById = getStationById;
exports.getDepartureAndTerminalStationWithIdLine = getDepartureAndTerminalStationWithIdLine;