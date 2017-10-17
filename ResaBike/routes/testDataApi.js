var request = require('request');
var dbStation = require('../db/station');
var dbLine = require('../db/line');
var dbZone = require('../db/zone');
var dbLineStation = require('../db/linestation');

var url = "https://timetable.search.ch/api/route.en.json?from=sierre&to=zinal,%20village%20des%20vacances";

// addStationsFromAPI();
// dbZone.createZone("Anniviers");
// addLinesFromAPI();
// addRelationsBetweenStationsAndLines();
// getStopIDFromAPI("https://timetable.search.ch/api/stationboard.en.json?stop=Zinal,%20village%20de%20vacances").then((id) => {
//     console.log("stopid : " + id);
// })
// dbZone.upsertZone("Annivierss");

function getDataFromAPI(url){
    return new Promise((resolve, reject)=>{
        request(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var obj = JSON.parse(body);
                console.log(url);
                console.log("COUNT : " + (obj.count > '0'));
                if((obj.count > '0')){
                    console.log("je vais dans le true");
                    resolve(obj);                    
                } else {
                    console.log("je vais dans le false");          
                    reject("Error !");                           
                }
            }
        })  
    })
}

function getStopIDFromAPI(url){
    return new Promise((resolve, reject)=>{
        request(url, function (error, response, body) {
            console.log(url);
            if (!error && response.statusCode === 200) {
                var obj = JSON.parse(body);
                var stop = obj.stop;
                let putindefdp = stop.id;
                resolve(putindefdp);   
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

// function addRelationsBetweenStationsAndLines(){
//     getDataFromAPI(url)
//     .then((obj) =>{
//         var legs = obj.connections[0].legs;
//         console.log("hello");
//         for(let i = 1 ; i<legs.length ; i++){
//             //get lineId by lineNumber
//             let idLine = dbLine.getLineIdByLineNumber(legs[i].line);
//             //get station id by name
//             let idStation = dbStation.getStationIdByName(legs[i].name);
//             Promise.all([idStation, idLine]).then((res) =>{
//                 dbLineStation.insertStationIdAndLineId(res[0], res[1], 1);
//             })
//             for(let j = 0 ; j < legs[i].stops.length ; j++){
//                 idStation = dbStation.getStationIdByName(legs[i].stops[j].name);
//                 Promise.all([idStation, idLine]).then((res) =>{
//                     dbLineStation.insertStationIdAndLineId(res[0], res[1], (j+2));
//                 })  
//             }           
//         }
//     })
// }

exports.getDataFromAPI = getDataFromAPI;
exports.getStopIDFromAPI = getStopIDFromAPI;
