var express = require('express');
var router = express.Router();
var requestData = require('./testDataApi');
var session = require('express-session');
var dbLine = require('../db/line');
var dbZone = require('../db/zone');
var dbStation = require('../db/station');
var dbLineStation = require('../db/linestation');
var zoneSelected;
var zones;
/* GET all user's zone home page. */
router.get('/', (req, res, next) => {
    //get all zones
    dbZone.getAllZones().then((zones) => {
        zones = zones;
        res.render('zoneAllIndex', {zones: zones});        
    })
});

//delete one zone's line
router.delete('/delete/line/:id', (req, res, next) => {
    var promises = [];
    //get all stations with idLine (to delete them)
    dbLineStation.getAllStationsWithIdLine(req.params.id).then((stations) => {
        dbLineStation.deleteLineIdFromLineStation(req.params.id).then(() => {
            stations.forEach((s) => {
                dbStation.deleteStation(s.StationId);
            })
            dbLine.deleteLineById(req.params.id);
            res.send(JSON.stringify("ok"));            
        });  
    });
})

//get one zone home page
router.get('/get/:id', (req, res, next) => {
    let lines;
    var stations;
    //get the zone by id
    dbZone.getZoneById(req.params.id).then((zone) => {
        //save the selected zone
        zoneSelected = zone;
        //get the lines depending on the zone
        var lines = [];
        var departures = [];
        var terminals = [];
        var promises = [];
        
        dbLine.getLinesByIdZone(zone.id).then((resu) => {
            lines = resu;
            lines.forEach(function(l){
                console.log(l.DepartureId + " " + l.ArrivalId)
                promises.push(dbStation.getDepartureAndTerminalStationWithIdLine(l.DepartureId, l.ArrivalId));
            })            

            Promise.all(promises).then((result) => {
                for(let k = 0 ; k<promises.length; k++){
                    departures.push(result[k].dep);
                    terminals.push(result[k].ter);
                }
                res.render('zoneOneIndex', {zone: zone, lines: lines , dep: departures, ter: terminals});            
            })
        })
    })    
});

//get the create zone page
router.get('/create', (req, res, next) => {
    res.render('createZone');
});

//POST when you receive the name and the stations for zone creation
router.post('/create', (req, res, next) => {
        //get values from form
        let zoneName = req.body.zoneName;
        let departure = req.body.departure.replace(/ /g, '%20');
        let arrival = req.body.arrival.replace(/ /g, '%20'); 

        var message;

        //request the api with the correct url
        var url = "https://timetable.search.ch/api/route.en.json?"    
        //modify the url according to the stations    
        url += "from=" + departure;
        url += "&to="+ arrival;    
        requestData.getDataFromAPI(url)
        .then((obj) => {
            var legs = obj.connections[0].legs;
            // variables for lines dep and ter
            var lines = [];
            var departures = [];
            var departuresID = [];
            var terminals = [];
            var terminalsID = [];
            var stops = [];
            var stopsID = [];

            //stocker les promises
            var promDep;
            var promArr;
            var promZone;

            //convert string to int (ascii addition)
            let idZone = convertStringToIntASCII(zoneName);  
            //create the zone                      
            promZone = dbZone.createZone(idZone, zoneName);

            for(let i = 0 ; i<legs.length ; i++){
                //check if the legs type is post or bus
                if(legs[i].type == 'post' || legs[i].type == 'bus'){

                    //add the lines to the array
                    lines.push(legs[i].line);
                    //add departure station of line
                    departures.push(legs[i].name)
                    //add terminal station of line
                    terminals.push(legs[i].terminal);
                    //add departure station id
                    departuresID.push(legs[i].stopid);
                    
                    //get all stops in line
                    legs[i].stops.forEach(function(s) {
                        stops.push(s.name);
                        stopsID.push(s.stopid);
                    }, this);

                    //get stopid terminal station
                    var stopidUrl = "https://timetable.search.ch/api/stationboard.en.json?stop=";                    
                    stopidUrl += legs[i].terminal.replace(/ /g, '%20');
                    requestData.getStopIDFromAPI(stopidUrl).then((terminalId) => {
                        //add the departure and terminal stations
                        promDep = dbStation.upsertStation(legs[i].stopid, legs[i].name);
                        promArr = dbStation.upsertStation(terminalId, legs[i].terminal);

                        Promise.all([promDep, promArr, promZone]).then((res) => {
                            dbLine.insertLine(legs[i].line, legs[i].name, legs[i].terminal, zoneName)
                            .then((idLine) => {
                                //add relations between departure and line
                                dbLineStation.insertStationIdAndLineId(res[0], idLine, 1, true);
                                //add relations between terminal and line 
                                console.log("RES1 : " +res[1]);       
                                dbLineStation.insertStationIdAndLineId(res[1], idLine, (stops.length + 2), true);                                
                                //add the stops and the relations with the line
                                for(let k = 0 ; k<stops.length ; k++){
                                    dbStation.upsertStation(stopsID[k], stops[k])
                                    .then((idStop) => {
                                        dbLineStation.insertStationIdAndLineId(idStop, idLine, (k+2), false);
                                    });
                                }
                                console.log("STOPS LENGTH" + stops.length);
                            });
                        })
                    })
                }
            }
            res.redirect('/zone');               
        }).catch((err) => {
            console.log("Alekserror ! " + err);
            res.redirect('/zone');   
        });
});

function convertStringToIntASCII(zone){
    zone = zone.toLowerCase();
    let res = 0;
    for(let i = 0 ; i<zone.length ; i++)
        res += zone.charCodeAt(i);
    return res;
}



module.exports = router;
