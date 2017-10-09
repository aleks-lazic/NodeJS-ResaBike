var express = require('express');
var router = express.Router();
var requestData = require('./testDataApi');

var url = "https://timetable.search.ch/api/route.en.json?"

/* GET zone home page. */
router.get('/', (req, res, next) => { 
    res.render('createZone');
});

router.post('/', (req, res, next) => {
    //get values from form
    let departure = req.body.departure.replace(/ /g, '%20');
    let arrival = req.body.arrival.replace(/ /g, '%20'); 
    //modify the url according to the    
    url += "from=" + departure;
    url += "&to="+ arrival;
    //request the api
    requestData.getDataFromAPI(url)
    .then((obj) => {
        console.log("ALEKS " + obj);
        var legs = obj.connections[0].legs;
        var object = {
            lines: [],
            arrivals: [],
            terminals: []
        };
        for(let i = 0 ; i<legs.length ; i++){
            if(legs[i].stops === null){
                continue;
            }
            object.lines.push(legs[i].line);
            object.arrivals.push(legs[i].name);
            object.terminals.push(legs[i].terminal);
        }
    })
    res.redirect('/zone');
})

module.exports = router;
