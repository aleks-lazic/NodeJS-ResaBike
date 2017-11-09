var express = require('express');
var router = express.Router();
var dbRole = require('../db/role');
var dbUser = require('../db/user');
var dbZone = require('../db/zone');
var session = require('express-session');
var redirection = require('../modules/redirection');
var crypto = require('crypto');

/**
 * Get all zone admins
 */
router.get('/getAllZoneAdmin', function(req, res, next) {
    dbUser.getAllUsersByRole("zoneadmin").then((users) => {
        res.send(JSON.stringify(users));
    })
});

/**
 * get users page if access authorized
 */
router.get('/', function(req, res, next) {

    var access = redirection.redirectUser(session.user);
    
    if(access != 'ok'){
        res.redirect('/'+res.locals.langUsed +access);
        return;
    }

    var promises = [];
    var roles = [];

    dbUser.getAllUsers().then((users) => {
        for(let k = 0 ; k<users.length ; k++){
            //get the role name
            promises.push(dbRole.getRoleNameById(users[k].RoleId).then((name) => {
                users[k].roleName = name;
            }));
            if(users[k].ZoneId != null){
                promises.push(dbZone.getZoneById(users[k].ZoneId).then((zone) => {
                    users[k].zoneName = zone.name;
                }))
            }
        }

        Promise.all(promises).then((resu) => {
            console.log(users);
            res.render('getAllUsers', {users: users, roles: roles, currentUser: session.user});                    
        })
    }) 
});

/**
 * logout
 */
router.get('/logout', function(req, res, next) {
    session.user = null;
    res.redirect('/' + res.locals.langUsed + '/login');
})

/**
 * Create a new user
 */
router.post('/create', (req, res, next) => {
    //check if the username already exists
    dbUser.checkUsernameExists(req.body.username).then((user) => {
        if(user == null) {
            //the user does not exist, check if the passwords are the same
            if(req.body.password == req.body.password2){
                //encrypt the password
                var secret = "You'll never find the key";
                var hash = crypto.createHmac('sha256', secret)
                                .update(req.body.password)
                                .digest('hex');
                console.log(hash);
                //passwords ok, create the user in the db
                if(req.body.idZone > 0){
                    dbUser.createUserWithZoneId(req.body.username, hash, req.body.email, req.body.role, req.body.idZone).then(() => {
                        res.send(JSON.stringify('success'));
                    })
                } else {
                    dbUser.createUser(req.body.username, hash, req.body.email, req.body.role).then(() => {
                        res.send(JSON.stringify('success'));
                    })
                }
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

/**
 * Get all roles
 */
router.get('/getAllRoles', (req, res, next) => {
    dbRole.getAllRoles().then((roles) => {
        res.send(JSON.stringify(roles));
    })
})

/**
 * update an existing user
 */
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

/**
 * delete a user
 */
router.delete('/:id', (req, res, next) => {
    dbUser.deleteUser(req.params.id).then(() => {
        res.send('success');
    })
})

module.exports = router;
