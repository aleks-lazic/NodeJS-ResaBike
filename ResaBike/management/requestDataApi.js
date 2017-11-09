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


// bookingsManagement.addTripsToCorrectLineHours(1371).then((wholeObject) => {
//     bookingsManagement.sortDataToGetReservationsToCome(wholeObject).then((object) => {
//         console.log(JSON.stringify(object));
//     });
// })
// bookManagement.getAllConnections('Sierre', 'Zinal', '2017/11/10', 1).then((connections) => {
//     console.log(connections);
// })

// getDataFromAPI("https://timetable.search.ch/api/route.en.json?from=Sierre&to=Zinal&date=2017/11/10&time=06:00");
// bookingsManagement.showAllZonesForReservations().then((zones) => {
//     console.log(zones[0].books);
// });

// bookingsManagement.getAllBookDetails(1371).then((zone) => {
//     console.log(zone.bookDetails[1]);
// })

// bookingsManagement.getTripStationsName(1371).then((reservationObject) => {
//     console.log(JSON.stringify(reservationObject));
// })

// bookingsManagement.addTripsToCorrectLineHours(1371).then((wholeObject) => {
//     console.log(JSON.stringify(wholeObject));
// });
// bookingsManagement.getAllBookDetails(1371).then((zone) => {
//     zone.books.forEach((b) => {
//         console.log(b.DepartureId);
//         console.log(b.ArrivalId);
//     })
// })
// dbTrip.getAllReservationsByDepartureAndLine('2017-11-01 10:25:00', 453).then((obj) => {
//     console.log(obj);
// })
// 

// dbBook.getSumWithMultipleLines('2017-11-01 11:25:00', [451, 453]).then((max) => {
//     console.log(max);
// })

var getDataFromAPI = function(url){
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

function sayFuck(){
    console.log("fuck hehe");
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

// dbStation.getAllStationsWithLineId(453).then((res) =>{
//     res.forEach((s) => {
//         console.log(s.name);
//     })
// });

//addStationsFromAPI();
//addLinesFromAPI();


// dbStation.deleteStation(8501996);

exports.sayFuck = sayFuck;
exports.getDepartureAndTerminalFromAPI = getDepartureAndTerminalFromAPI;
exports.getDataFromAPI = getDataFromAPI;
exports.getStopIDFromAPI = getStopIDFromAPI;
