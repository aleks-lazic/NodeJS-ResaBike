var express = require('express');
var router = express.Router();
var requestData = require('./testDataApi');
var session = require('express-session');
var dbLine = require('../db/line');
var dbZone = require('../db/zone');
var dbStation = require('../db/station');

var url = "https://timetable.search.ch/api/route.en.json?"
var stopidUrl = "https://timetable.search.ch/api/stationboard.en.json?stop=";
/* GET zone home page. */
router.get('/', (req, res, next) => {
    res.render('createZone', {object: session.object});
});

//POST when you receive the name and the stations for zone creation
router.post('/createZone', (req, res, next) => {
        //get values from form
        let zoneName = req.body.zoneName;
        let departure = req.body.departure.replace(/ /g, '%20');
        let arrival = req.body.arrival.replace(/ /g, '%20'); 

        //modify the url according to the stations    
        url += "from=" + departure;
        url += "&to="+ arrival;

        console.log("url : " + url);

        //request the api with the correct url
        requestData.getDataFromAPI(url)
        .then((obj) => {
            var legs = obj.connections[0].legs;
            session.object = {
                lines: [],
                arrivals: [],
                terminals: [],
                zoneName: zoneName
            };

            for(let i = 0 ; i<legs.length ; i++){
                if(legs[i].type == 'post' || legs[i].type == 'bus'){
                    //add the lines arrivals and terminals for the lines
                    session.object.lines.push(legs[i].line);
                    session.object.arrivals.push(legs[i].name);
                    session.object.terminals.push(legs[i].terminal);

                    //upsert the zone
                    dbZone.upsertZone(session.object.zoneName).then(() => {
                    //get name station departure
                    let dep = legs[i].name;
                    let stopid = legs[i].stopid;
                    //get arrival station and stopid
                    let terminal = legs[i].terminal;
                    //request the API to get the terminal's station id
                    stopidUrl += terminal.replace(/ /g, '%20');
                    requestData.getStopIDFromAPI(stopidUrl).then((putindefdp) => {
                        dbStation.upsertStation(putindefdp, terminal).then(() => {
                            //add departure station to the db
                            dbStation.upsertStation(stopid, dep).then(() => {
                                dbLine.insertLine(session.object.lines[i],session.object.arrivals[i], session.object.terminals[i], session.object.zoneName);                            
                            });                
                        });
                    });
                });
            }
        }
        res.redirect('/zone');        
    });
});


module.exports = router;
