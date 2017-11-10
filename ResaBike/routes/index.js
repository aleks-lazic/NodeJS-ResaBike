var express = require('express');
var router = express.Router();
var dbStation = require('../db/station');
var requestData = require('../management/requestDataApi');
var email = require('../modules/email');
var dbUser = require('../db/user');
var session = require('express-session');
var dbBook = require('../db/book');
var bookManagement = require('../management/bookManagement');
var crypto = require('crypto');


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
    //encrypt the password
    var secret = "You'll never find the key";
    var hash = crypto.createHmac('sha256', secret)
                    .update(req.body.password)
                    .digest('hex');
    //check if the username exists
    dbUser.checkLogin(req.body.username, hash).then((user) => {
        if(user == null){
            res.send('error');
        } else {
            session.user = user;
            res.send(JSON.stringify(user));          
        }
    })

})

/**
 * get all the connections with the book
 * call of the book management
 */
router.post('/book', function(req, res, next){
    //If the client put the same departure and arrival it simply redirect to /
    if(req.body.departureFrom == req.body.arrivalTo){
        res.redirect('/');
        return;
    }

    bookManagement.getAllConnections(req.body.departureFrom, req.body.arrivalTo, req.body.dateTravel, req.body.hourDep ,req.body.nbBike).then((connections) => {
        res.render('book', {connections: connections});
    })
});

/**
 * sends the mail for the feedback
 */
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
