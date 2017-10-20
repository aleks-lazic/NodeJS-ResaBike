var express = require('express');
var router = express.Router();
var dbRole = require('../db/role');
var dbUser = require('../db/user');


/* GET creation home page user. */
router.get('/create', function(req, res, next) { 
    res.render('createUser');
});

//GET all ZONEADMINS
router.get('/getAllZoneAdmin', function(req, res, next) {
    dbUser.getAllUsersByRole("zoneadmin").then((users) => {
        res.send(JSON.stringify(users));
    })
});

//GET all users
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

//POST create new user
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

//GET all roles
router.get('/getAllRoles', (req, res, next) => {
    dbRole.getAllRoles().then((roles) => {
        res.send(JSON.stringify(roles));
    })
})

//PUT update existing user
router.put('/update', (req, res, next) => {  
    //if the username has not changed
    if(req.body.same == 'true'){
        //update only the mail
        dbUser.updateUserOnlyMail(req.body.email, req.body.id).then(() => {
            res.send("success");
        })
    } else {
        //check if the username already exists
        dbUser.checkUsernameExists(req.body.username).then((user) => {
            console.log("username : " + req.body.username);
            console.log("user.name" + user);
            if(user == null) {
                //the user does not exist, we can update the user
                dbUser.updateUser(req.body.username, req.body.email, req.body.id).then(() => {
                    res.send("success");
                });
            } else {
                res.send("username");
            }
        }); 
    }
})

//DELETE user
router.delete('/:id', (req, res, next) => {
    dbUser.deleteUser(req.params.id).then(() => {
        res.send('success');
    })
})




module.exports = router;
