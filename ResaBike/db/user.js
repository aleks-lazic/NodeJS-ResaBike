var models = require('../models');
var dbRole = require('../db/role');


var checkUsernameExists = function(username){
    return new Promise((resolve, reject)=>{
        models.User.findOne({
            where:{
                username: username
            }
        }).then(user =>{
            resolve(user);
        }).catch((err)=>{
            reject(err.message);
        })
    })
}

var createUser = function(username, password, email, role){
    return new Promise((resolve, reject) => {
        //get the role's id with the role
        dbRole.getIdRoleByName(role).then((idRole) => {
            models.User.create({
                username: username,
                password: password,
                mail: email,
                RoleId: idRole
            }).then(() => {
                resolve();
            }).catch((err)=> {
                reject(err.message);
            });
        })
    })
}

var getAllUsers = function(){
    return new Promise((resolve, reject)=>{
        models.User.findAll({
        }).then(users =>{
            resolve(users);
        }).catch((err)=>{
            reject(err.message);
        })
    })
}

var updateUser = function(username, email, id){
    return new Promise((resolve, reject) => {
        models.User.update({
            username: username,
            mail: email},
            {where:{
                id: id
            }
        }).then(() => {
            resolve();
        }).catch((err) => {
            reject(err.message);
        });
    })
}

var updateUserOnlyMail = function(email, id){
    return new Promise((resolve, reject) => {
        models.User.update({
            mail: email},
            {where: {
                id: id
            }
        }).then(() => {
            resolve();
        }).catch((err) => {
            reject(err.message);
        });
    })
}

exports.updateUserOnlyMail = updateUserOnlyMail;
exports.updateUser = updateUser;
exports.getAllUsers = getAllUsers;
exports.createUser = createUser;
exports.checkUsernameExists = checkUsernameExists;