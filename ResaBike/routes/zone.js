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
