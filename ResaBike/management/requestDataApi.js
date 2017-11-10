var request = require('request');
var dbStation = require('../db/station');
var dbLine = require('../db/line');
var dbZone = require('../db/zone');
var dbLineStation = require('../db/linestation');

var url = "https://timetable.search.ch/api/route.en.json?from=sierre&to=zinal,%20village%20des%20vacances";
var dbBook = require('../db/book');
var dbTrip = require('../db/trip');
var bookingsManagement = require('../management/bookingsManagement');
var bookManagement = require('../management/bookManagement');

/**
 * Retrieve data from api using url
 * Check if the url retrieve correct data otherwise reject an error
 * @param {*} url 
 */
var getDataFromAPI = function(url){
    return new Promise((resolve, reject)=>{
        request(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var obj = JSON.parse(body);
                if((obj.count > '0')){
                    resolve(obj);                    
                } else {
                    reject("Error !");                           
                }
            }
        })  
    })
}
/**
 * Retrieve a stop id from the api using url
 * @param {*} url 
 */
function getStopIDFromAPI(url){
    return new Promise((resolve, reject)=>{
        request(url, function (error, response, body) {
            console.log(url);
            if (!error && response.statusCode === 200) {
                var obj = JSON.parse(body);
                var stop = obj.stop;
                let stopid = stop.id;
                resolve(stopid);   
            }
        })  
    })
}
/**
 * Add all stations array from the api
 */
function addStationsFromAPI(){
    getDataFromAPI(url)
    .then((obj) => {
        var legs = obj.connections[0].legs;
        for(let i = 1 ; i<legs.length ; i++){
            dbStation.insertStation(legs[i].name);
            legs[i].stops.forEach(function(s) {
                dbStation.insertStation(s.name);                
            }, this);
        }
    })
}
/**
 * Add lines retrieved from the api
 */
function addLinesFromAPI(){
    getDataFromAPI(url)
    .then((obj) =>{
        var legs = obj.connections[0].legs;
        let i = 1;
 
        for(i = 1 ; i<legs.length ; i++){
            //si la legs est la dernière on return car il n'y a pas de line dedans
            if(legs[i].stops === null)
                return;
            
            let stationDeparture = legs[i].name;
            let stationTerminal = legs[i].terminal;
            dbLine.insertLine(legs[i].line, stationDeparture, stationTerminal, "Anniviers");
        }
    })
    
}

/**
 * Retrieve the correct departure and the correct terminal form the api using only a terminal station and the id
 * @param {*} terminalStation 
 * @param {*} idLine 
 */
function getDepartureAndTerminalFromAPI(terminalStation, idLine){
    return new Promise((resolve, reject) => {
        let url = 'http://timetable.search.ch/api/stationboard.en.json?stop=' + terminalStation
        request(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var obj = JSON.parse(body);
                var object = {
                    departure: "",
                    terminal: terminalStation
                }

                obj.connections.some((o) => {
                    if(o.line == idLine){
                        object.departure = o.terminal.name;
                        return;
                    }
                })
                url = 'http://timetable.search.ch/api/route.en.json?from='+object.departure + '&to=' + terminalStation;
                getDataFromAPI(url).then((object) => {
                    resolve(object);
                })
            }
        })  
    })
}


exports.getDepartureAndTerminalFromAPI = getDepartureAndTerminalFromAPI;
exports.getDataFromAPI = getDataFromAPI;
exports.getStopIDFromAPI = getStopIDFromAPI;
