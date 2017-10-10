var express = require('express');
var router = express.Router();
var requestData = require('./testDataApi');
var session = require('express-session');
var dbLine = require('../db/line')
var dbZone = require('../db/zone')

var url = "https://timetable.search.ch/api/route.en.json?"

/* GET zone home page. */
router.get('/', (req, res, next) => {
    res.render('createZone', {object: session.object});
});

//POST when you receive the name and the stations for zone creation
router.post('/', (req, res, next) => {
    //get values from form
    let departure = req.body.departure.replace(/ /g, '%20');
    let arrival = req.body.arrival.replace(/ /g, '%20'); 
    console.log("Zoooone" + req.body.zoneName);

    //modify the url according to the    
    url += "from=" + departure;
    url += "&to="+ arrival;
    //request the api
    requestData.getDataFromAPI(url)
    .then((obj) => {
        var legs = obj.connections[0].legs;
        session.object = {
            lines: [],
            arrivals: [],
            terminals: [],
            zoneName: req.body.zoneName,
            zoneCreated: false
        };
        for(let i = 0 ; i<legs.length ; i++){
            if(legs[i].stops === null){
                continue;
            }
            if(legs[i].line == null || legs[i].terminal == null){
                continue;
            }

            session.object.lines.push(legs[i].line);
            session.object.arrivals.push(legs[i].name);
            session.object.terminals.push(legs[i].terminal);

            console.log("The line should be : \n\tNumber : " + legs[i].line + "\n\tFrom : " + legs[i].name + "\n\tTo : " + legs[i].terminal);
            console.log("Object : " + session.object);
            res.redirect('/zone');
        }
    })
})


//POST when the users tries to create a new line
router.post('/createZone', (req, res) => {
    let id = req.body.index;
    console.log('create from ' + session.object.arrivals[id] + " to : " + session.object.terminals[id] + "line : " + session.object.lines[id]);
    if(!session.object.zoneCreated){
        console.log("The zone is created");
        dbZone.createZone(session.object.zoneName).then(() => {
            dbLine.insertLine(session.object.lines[id], session.object.arrivals[id], session.object.terminals[id], session.object.zoneName);            
            session.object.zoneCreated = true;            
        });
    }else {
        dbLine.insertLine(session.object.lines[id], session.object.arrivals[id], session.object.terminals[id], session.object.zoneName);        
    }
})

module.exports = router;
