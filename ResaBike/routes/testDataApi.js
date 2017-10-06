var express = require('express');
var router = express.Router();
var request = require('request');
var models = require('../models');
var dbStation = require('../db/station');
var dbLine = require('../db/line');
var dbZone = require('../db/zone');

var url = "https://timetable.search.ch/api/route.en.json?from=sierre&to=zinal";

// addStationsFromAPI();
// dbZone.createZone("Anniviers");
addLinesFromAPI();

function getDataFromAPI(url){
    return new Promise((resolve, reject)=>{
        request({
            url: url,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var obj = JSON.stringify(body);
                obj = JSON.parse(obj);
                resolve(obj);
            }
        })  
    })
}

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

function addLinesFromAPI(){
    getDataFromAPI(url)
    .then((obj) =>{
        var legs = obj.connections[0].legs;
        for(let i = 1 ; i<legs.length ; i++){
            //si la legs est la dernière on return car il n'y a pas de line dedans
            if(i == legs.length -1){
                return;
            }
            let stationDeparture = legs[i].name;
            let stationTerminal = legs[i].terminal;
            console.log(legs[i].line);
            dbLine.insertLine(legs[i].line, stationDeparture, stationTerminal, "Anniviers");
        }
    })
    
}

module.exports = router;