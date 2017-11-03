var express = require('express');
var router = express.Router();
var dbStation = require('../db/station');
var requestData = require('./testDataApi');
var email = require('../modules/email');
var dbUser = require('../db/user');
var session = require('express-session');
var dbBook = require('../db/book');


/* GET home page. */
router.get('/', function(req, res, next) { 
    res.render('index', { title: 'ResaBike'});
});

/* GET all stations for autocompletion. */
router.get('/getAllStations', function(req, res) {
    dbStation.getAllStations().then((result)=> {
        res.send(result);
    })
});

/* GET login Page */
router.get('/login', function(req, res, next) { 
    res.render('login');
});

//POST to confirm the login
router.post('/login', (req, res, next) => {
    //check if the username exists
    dbUser.checkLogin(req.body.username, req.body.password).then((user) => {
        if(user == null){
            res.send('error');
        } else {
            session.user = user;
            res.send(JSON.stringify(user));          
        }
    })

})

router.post('/book', function(req, res, next){
    
    //Retrieve the data from the user
    let departureFrom = req.body.departureFrom ;
    let arrivalTo = req.body.arrivalTo ;
    let dateTravelUser = req.body.dateTravel ;
    let nbBike = req.body.nbBike ;

    //If the client put the same departure and arrival it simply redirect to /
    if(departureFrom == arrivalTo){
        res.redirect('/');
        return;
    }


    //Comparing the date, time with the one selected from the user
    let currentTime = new Date();
    let currentHour = currentTime.getHours();
    let currentMinute = currentTime.getMinutes();
    let stringHourMinute = currentHour + ":" + currentMinute + ":00" ;

    let currentYear = currentTime.getFullYear().toString();
    let currentMonth = (currentTime.getMonth()+1).toString();
    let currentDay = currentTime.getDate().toString();
    //Date Of Today
    let stringCurrentDate = currentYear + '-' + currentMonth + '-' + currentDay ;

    //console.log(stringHourMinute);

    let url = "https://timetable.search.ch/api/route.en.json?from=" + departureFrom + "&to=" + arrivalTo + "&date=" + dateTravelUser;
    let arrayTimeDeparture = [] ;
    let arrayTimeArrival = [] ;

    //console.log('From : ' + departureFrom + ', To : ' + arrivalTo, " at Date : " + dateTravel);
    requestData.getDataFromAPI(url)
    .then((obj) => {
        //console.log(obj);
        let objct = obj.connections ;
        //console.log(objct);
        let lines = [] ;
        let linesWithoutDuplicates = [] ;

        for (let i = 0; i < objct.length ; i++) {
            var legs = objct[i].legs ;
            var trips = [];
            for (let j = 0 ; j < legs.length ; j++){
                if(legs[j].type == "post" || legs[j].type == "bus" ){
                    var trip = {
                        idDeparture : legs[j].stopid,
                        idTerminal : legs[j].exit.stopid
                    };
                    trips.push(trip);
                    //console.log(legs[j].departure);
                    lines.push(legs[j].line);
                    
                    //Delete the duplicated lines
                    linesWithoutDuplicates = lines.filter(function(line, j, self){
                        return j == self.indexOf(line);
                    })

                    let dateSplit = legs[j].departure.split(" ");
                    //console.log(dateSplit[0].split("-")[2]);
                    //console.log(dateTravelUser.split("-")[2]);
                    if(dateSplit[0].split("-")[2] == dateTravelUser.split("-")[2] && stringCurrentDate != dateTravelUser){
                        var arrayObject = {
                            timeDeparture: objct[i].departure
                        };
                        arrayTimeDeparture.push(arrayObject);
                        arrayTimeArrival.push(objct[i].arrival);
                        console.log("Entered if");
                    }
                    if(stringCurrentDate == dateTravelUser && dateSplit[1] > stringHourMinute){
                        var arrayObject = {
                            timeDeparture: objct[i].departure
                        };
                        arrayTimeDeparture.push(arrayObject);
                        arrayTimeArrival.push(objct[i].arrival);
                        console.log("entered else if");
                    }
                }
            }
        }
        //get the number of places available
        const MAX_PLACES = 6;
        let promisesPlaces = [];
        for(let k = 0 ; k<arrayTimeDeparture.length ; k++){
            promisesPlaces.push(dbBook.getSumWithMultipleLines(arrayTimeDeparture[k].timeDeparture,linesWithoutDuplicates).then((max) => {
                arrayTimeDeparture[k].placesAvailable = MAX_PLACES - max;
                if(arrayTimeDeparture[k].placesAvailable < 0){
                    arrayTimeDeparture[k].placesAvailable = 0;
                }
                console.log(arrayTimeDeparture[k].placesAvailable);               
            }));
        }

        Promise.all(promisesPlaces).then(() => {
            res.render('book', {arrayTimeDeparture: arrayTimeDeparture, arrayTimeArrival: arrayTimeArrival, departureFrom: departureFrom, arrivalTo: arrivalTo, nbBike: nbBike, dateTravelUser: dateTravelUser, lines: linesWithoutDuplicates, trips: trips});            
        })
        
    }).catch((err)=>{
        res.send('Error : ' + err.message);
    })

});

router.post('/sendMail', function(req, res, next){
    //Retrieving information from contact form
    let name_form = req.body.name_mail ;
    let email_form = req.body.email_mail ;
    let subject_form = req.body.subject_mail ;
    let message_form = req.body.message_mail ;

    //Sending email to myself
    let mailAddress = 'resabike.test@gmail.com';
    let mailSubject = name_form + ' - ' + email_form + ' - ' + subject_form ;
    let mailContent = message_form ;

    email.createEmail(mailAddress, mailSubject, mailContent);

    res.redirect('/');
});

module.exports = router;
