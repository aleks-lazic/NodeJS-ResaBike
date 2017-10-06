var express = require('express');
var router = express.Router();
var request = require('request');
var models = require('../models');

var url = "https://timetable.search.ch/api/route.en.json?from=sierre&to=zinal";
resetDatabase(false);

function resetDatabase(flag){
    if(!flag){
        return;
    }

    createZone();
}

function createZone(){
    models.Zone.create({
        name: "Anniviers"
    }).then(() =>{
        console.log('Zone correctly created !');
    }).catch((err) =>{
        res.send(err.message);
    });
}

function insertStationsWithLine(stationName, lineNumber){
    insertStation(stationName);
}

function insertStation(stationName){
    models.Station.create({
        name: stationName,
    }).then(() =>{
        console.log('Station added : ' + stationName);
    }).catch((err) =>{
        console.log(err.message);
    });
}

// function insertLine(lineNumber, zoneId, ){
//     models.Station.create({
//         name: stationName,
//     }).then(() =>{
//         console.log('Station added : ' + stationName);
//     }).catch((err) =>{
//         console.log(err.message);
//     });
// }


function createLinesByZone(name){
    models.Line.create({

    });
}


request({
    url: url,
    json: true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {
        
        var obj = JSON.stringify(body);
        obj = JSON.parse(obj);
        var conn = obj.connections;
        var legs = obj.connections[2].legs;
        legs.forEach((l) =>{
            console.log("Nouvelle Ligne : " + l.line);            
            console.log(l.name);
            insertStation(l.name);
            if(l.stops != undefined){
                l.stops.forEach((s) =>{
                    console.log(s.name);
                    insertStation(s.name);                    
                })
            }

        }, this);
    }
})

module.exports = router;