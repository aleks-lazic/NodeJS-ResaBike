var express = require('express');
var router = express.Router();
var dbRole = require('../db/role');
var dbUser = require('../db/user');


/* GET creation home page user. */
router.get('/create', function(req, res, next) { 
    res.render('createUser');
});

//get all users
router.get('/', function(req, res, next) {
    var promises = [];
    var roles = [];

    dbUser.getAllUsers().then((users) => {
        users.forEach(function(u) {
            promises.push(dbRole.getRoleNameById(u.RoleId));
        }, this);

        Promise.all(promises).then((resu) => {
            resu.forEach(function(r){
                roles.push(r);
            })
            res.render('getAllUsers', {users: users, roles: roles});                    
        })
    }) 
});

router.post('/create', (req, res, next) => {
    //check if the username already exists
    dbUser.checkUsernameExists(req.body.username).then((user) => {
        if(user == null) {
            //the user does not exist, check if the passwords are the same
            if(req.body.password == req.body.password2){
                //passwords ok, create the user in the db
                dbUser.createUser(req.body.username, req.body.password, req.body.email, req.body.role).then(() => {
                    res.send(JSON.stringify('success'));
                })
            } else {
                //the passwords are not matching
                res.send(JSON.stringify('password'));
                return;    
            }
        } else {
            //the user already exists
            console.log("The user already exists");
            res.send(JSON.stringify('username'));
            return;
        }
    });    
})

router.get('/getAllRoles', (req, res, next) => {
    dbRole.getAllRoles().then((roles) => {
        res.send(JSON.stringify(roles));
    })
})


module.exports = router;
