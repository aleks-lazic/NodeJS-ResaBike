var express = require('express');
var router = express.Router();
var requestData = require('./testDataApi');
var session = require('express-session');
var dbLine = require('../db/line');
var dbZone = require('../db/zone');
var dbStation = require('../db/station');
var dbLineStation = require('../db/linestation');
var dbUser = require('../db/user');
var zones;

/* GET all user's zone home page. */
router.get('/', (req, res, next) => {
    //get all zones
    dbZone.getAllZones().then((zones) => {
        res.render('getAllZones', {zones: zones}); 
    })
});

/* GET all zones to populate the dropdown */
router.get('/getAllZones', (req, res, next) => {
    //get all zones
    dbZone.getAllZones().then((zones) => {
        res.send(JSON.stringify(zones));                           
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
router.get('/:id', (req, res, next) => {
    let promises = [];
    //get the selected zone
    promises.push(dbZone.getZoneById(req.params.id));
    //get the lines depending on the zone
    promises.push(dbLine.getLinesByIdZone(req.params.id));

    Promise.all(promises).then((resu) => {
        var stationsPromises = [];
        var lines = [];
        resu[1].forEach((line) => {
            stationsPromises.push(dbStation.getStationById(line.DepartureId).then((station) => {
                line['departure'] = station.name;
            }));
            stationsPromises.push(dbStation.getStationById(line.ArrivalId).then((station) => {
                line['terminal'] = station.name                
            }));
        })

        Promise.all(stationsPromises).then((stations) => {
            res.render('getOneZone', {zone: resu[0], lines : resu[1]})                                                        
        })
    })   
});


//POST when you receive the name and the stations for zone creation
// router.post('/create', (req, res, next) => {
//         //get values from form
//         let zoneName = req.body.zoneName;
//         let departure = req.body.departure.replace(/ /g, '%20');
//         let arrival = req.body.arrival.replace(/ /g, '%20'); 

//         var message;

//         //request the api with the correct url
//         var url = "https://timetable.search.ch/api/route.en.json?"    
//         //modify the url according to the stations    
//         url += "from=" + departure;
//         url += "&to="+ arrival;    
//         requestData.getDataFromAPI(url)
//         .then((obj) => {
//             var legs = obj.connections[0].legs;
//             // variables for lines dep and ter
//             var lines = [];
//             var departures = [];
//             var departuresID = [];
//             var terminals = [];
//             var terminalsID = [];

//             //stocker les promises
//             var promDep;
//             var promArr;
//             var promZone;

//             //convert string to int (ascii addition)
//             let idZone = convertStringToIntASCII(zoneName);  
//             //create the zone                      
//             promZone = dbZone.createZone(idZone, zoneName);

//             for(let i = 0 ; i<legs.length ; i++){
//                 //check if the legs type is post or bus
//                 if(legs[i].type == 'post' || legs[i].type == 'bus'){

//                     //add the lines to the array
//                     lines.push(legs[i].line);
//                     //add departure station of line
//                     departures.push(legs[i].name)
//                     //add terminal station of line
//                     terminals.push(legs[i].terminal);
//                     //add departure station id
//                     departuresID.push(legs[i].stopid);

//                     //get stopid terminal station
//                     var stopidUrl = "https://timetable.search.ch/api/stationboard.en.json?stop=";                    
//                     stopidUrl += legs[i].terminal.replace(/ /g, '%20');
//                     requestData.getStopIDFromAPI(stopidUrl).then((terminalId) => {
//                         //add the departure and terminal stations
//                         promDep = dbStation.upsertStation(legs[i].stopid, legs[i].name);
//                         promArr = dbStation.upsertStation(terminalId, legs[i].terminal);

//                         Promise.all([promDep, promArr, promZone]).then((res) => {
//                             dbLine.insertLine(legs[i].line, legs[i].name, legs[i].terminal, zoneName)
//                             .then((idLine) => {
//                                 //add relations between departure and line
//                                 dbLineStation.insertStationIdAndLineId(res[0], idLine, 1, true);
//                                 //add relations between terminal and line 
//                                 console.log("RES1 : " +res[1]);       
//                                 dbLineStation.insertStationIdAndLineId(res[1], idLine, (legs[i].stops.length +2), true);                                
//                                 //add the stops and the relations with the line
//                                 for(let k = 0 ; k<legs[i].stops.length ; k++){
//                                     dbStation.upsertStation(legs[i].stops[k].stopid, legs[i].stops[k].name)
//                                     .then((idStop) => {
//                                         dbLineStation.insertStationIdAndLineId(idStop, idLine, (k+2), false);
//                                     });
//                                 }
//                             });
//                         })
//                     })
//                 }
//             }
//             res.redirect('/zone');               
//         }).catch((err) => {
//             console.log("Alekserror ! " + err);
//             res.redirect('/zone');   
//         });
// });

router.post('/create/line', (req, res, next) => {
    console.log(req.body.idZone + "ZOOOOOONE");
    //get values from body
    let departure = req.body.departure;
    let arrival = req.body.arrival;

    //modify the url depending on departure and arrival
    var url = "http://timetable.search.ch/api/route.en.json?from=";

    //get values form api
    requestData.getDataFromAPI(url + departure + '&to=' + arrival).then((object) => {
        //récupérer les lines
        var legs = object.connections[0].legs;
        legs.forEach((l) => {
            if(l.type == 'post' || l.type == 'bus'){
                //aller chercher le bon departure
                requestData.getDepartureAndTerminalFromAPI(l.terminal,l.line).then((obj) => {
                    //nous avons le bon departure et le bon terminal
                    //on peut ajouter la ligne dans la base de données
                    legs = obj.connections[0].legs;
                    legs.forEach((line) => {
                        if(line.type == 'post' || line.type == 'bus'){
                            var promises = [];
                            //insert the departure station into the db
                            promises.push(dbStation.upsertStation(line.stopid, line.name));
                            //insert the terminal station into the db
                            promises.push(dbStation.upsertStation(line.exit.stopid, line.exit.name));                        

                            Promise.all(promises).then((res) => {
                                dbLine.insertLine(line.line, line.name, line.terminal, req.body.idZone).then((idLine) => {
                                    dbLineStation.insertStationIdAndLineId(res[0], idLine, 1, true);
                                    dbLineStation.insertStationIdAndLineId(res[1], idLine, line.stops.length + 2, true);
                                    for(let k = 0 ; k<line.stops.length ; k++){
                                        let s = line.stops[k];
                                        dbStation.upsertStation(s.stopid, s.name).then(() => {
                                            dbLineStation.insertStationIdAndLineId(s.stopid, idLine, k+2, false);
                                        })
                                    }
                                });
                            })
                        }   
                    })
                    res.send('success');
                })
            }
        })
    })
})

router.post('/create', (req, res, next) => {
    //get all values from form
    let zoneName = req.body.name;

    //create the zone
    dbZone.createZone(zoneName).then(() => {
        res.send('success')
    });

});

router.put('/update', (req, res, next) => {
    //get all values from form
    let zoneName = req.body.name;
    let id = req.body.id;

    //update the zone
    dbZone.updateZoneById(id, zoneName).then(() => {
        res.send('success')        
    })
});

router.delete('/delete/:id', (req, res, next) => {
    console.log('delete');
    dbZone.deleteZone(req.params.id).then(() => {
        res.send('success');
    })
})


module.exports = router;
