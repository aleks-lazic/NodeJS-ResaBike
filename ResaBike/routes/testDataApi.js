var express = require('express');
var router = express.Router();
var request = require('request');
var models = require('../models');

var url = "https://timetable.search.ch/api/route.en.json?from=sierre&to=zinal";
var stationDeparture;
var stationTerminal;

resetDatabase(false);

function resetDatabase(flag){
    if(!flag){
        return;
    }
    createZone();
}

function createZone(){
    return new Promise((resolve, reject)=>{
        models.Zone.create({
            name: "Anniviers"
        }).then(() =>{
            console.log('Zone correctly created !');
        }).catch((err) =>{
            res.send(err.message);
        });
    })
}

function insertStation(stationName){
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

function getStationIdByName(name){
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

function getZoneIdByName(name){
    return new Promise((resolve, reject) =>{
        models.Zone.findOne({
            where: {
                name: name
            }
        }).then((res)=> {
            resolve(res.id);
        });
    })
   
}

function getAllStations(){
    return new Promise((resolve, reject)=>{
        models.Station.findAll({
        }).then(stations =>{
           console.log(JSON.stringify(stations));
        }).catch((err)=>{
          console.log('Error : ' + err.message);
        })
    })
}


function insertLine(lineNumber, zoneName, stationDeparture, stationTerminal){
    //get the id of station departure
    let idDeparture = getStationIdByName(stationDeparture);
    //get the id of station terminal
    let idTerminal = getStationIdByName(stationTerminal);
    //get the id of the zone
    let idZone = getZoneIdByName(zoneName);

    Promise.all([idDeparture, idTerminal, idZone]).then((res)=>{
        models.Line.create({
            number: lineNumber,
            ZoneId: res[2],
            DepartureId: res[0],
            ArrivalId: res[1]
        }).then(() =>{
            console.log('Line added : ');
        }).catch((err) =>{
            console.log(err.message);
        });
    })
}


request({
    url: url,
    json: true
}, function (error, response, body) {
    if (!error && response.statusCode === 200) {
        var obj = JSON.stringify(body);
        obj = JSON.parse(obj);
        var legs = obj.connections[2].legs;
        legs.forEach((l) =>{
            stationDeparture = l.name;
            stationTerminal = l.terminal;
            console.log("Nouvelle Ligne : " + l.line);
            if(l.stops != undefined){
                l.stops.forEach((s) =>{
                    
                })
            }
        }, this);
    }
})

module.exports = router;