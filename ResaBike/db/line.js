var dbZone = require('./zone');
var dbStation = require('./station');
var models = require('../models');


var insertLine = function(lineNumber, stationDeparture, stationTerminal, zoneName){
    //get the id of station departure
    let idDeparture = dbStation.getStationIdByName(stationDeparture);
    //get the id of station terminal
    let idTerminal = dbStation.getStationIdByName(stationTerminal);
    //get the id of the zone
    let idZone = dbZone.getZoneIdByName(zoneName);
    
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

exports.insertLine = insertLine;