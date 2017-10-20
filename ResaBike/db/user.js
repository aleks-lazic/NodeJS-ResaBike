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

var deleteUser = function(id){
    return new Promise((resolve, reject) => {
        models.User.destroy({
            where:{
                id: id
            }
        }).then(() => {
            resolve();
        }).catch((err)=> {
            reject(err.message);
        });
    })
}

var getAllUsersByRole = function(roleName){
    return new Promise((resolve, reject) => {
        dbRole.getIdRoleByName(roleName).then((idRole) => {
            models.User.findAll({
                where:{
                    RoleId: idRole
                }
            }).then(users =>{
                resolve(users);
            }).catch((err)=>{
                reject(err.message);
            })
        });
    })
}

var updateUserZoneId = function(idUser, idZone){
    return new Promise((resolve, reject) => {
        models.User.update({
            ZoneId: idZone},
            { where: {
                id: idUser
            }
        }).then(() => {
            resolve();
        }).catch((err) => {
            reject(err.message);
        });
    })
}

var getUserByZoneId = function(idZone){
    return new Promise((resolve, reject) => {
        models.User.findAll({
            where:{
                ZoneId: idZone
            }
        }).then(users =>{
            resolve(users);
        }).catch((err)=>{
            reject(err.message);
        })
    });
}

exports.getUserByZoneId = getUserByZoneId;
exports.updateUserZoneId = updateUserZoneId;
exports.getAllUsersByRole = getAllUsersByRole;
exports.deleteUser = deleteUser;
exports.updateUserOnlyMail = updateUserOnlyMail;
exports.updateUser = updateUser;
exports.getAllUsers = getAllUsers;
exports.createUser = createUser;
exports.checkUsernameExists = checkUsernameExists;