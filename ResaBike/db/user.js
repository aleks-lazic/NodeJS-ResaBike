var models = require('../models');
var dbRole = require('../db/role');
/**
 * Check if a username exists in the database
 * @param {*} username 
 */
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
/**
 * Create a user in the database
 * @param {*} username 
 * @param {*} password 
 * @param {*} email 
 * @param {*} role 
 */
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
/**
 * Create a user with a zone linked to it 
 * @param {*} username 
 * @param {*} password 
 * @param {*} email 
 * @param {*} role 
 * @param {*} zoneId 
 */
var createUserWithZoneId = function(username, password, email, role, zoneId){
    return new Promise((resolve, reject) => {
        //get the role's id with the role
        dbRole.getIdRoleByName(role).then((idRole) => {
            models.User.create({
                username: username,
                password: password,
                mail: email,
                RoleId: idRole,
                ZoneId: zoneId
            }).then(() => {
                resolve();
            }).catch((err)=> {
                reject(err.message);
            });
        })
    })
}
/**
 * Retrieve all users from the database
 */
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
/**
 * Update a user in the database
 * @param {*} username 
 * @param {*} email 
 * @param {*} id 
 */
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
/**
 * Update a users email only
 * @param {*} email 
 * @param {*} id 
 */
var updateUserOnlyMail = function(email, id){
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
}

/**
 * Delete a user from the database
 * @param {*} id 
 */
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
/**
 * Get all users using its role
 * @param {*} roleName 
 */
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
/**
 * Update a user using its id
 * @param {*} idUser 
 * @param {*} idZone 
 */
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
/**
 * Get user using its zone id
 * @param {*} idZone 
 */
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
/**
 * Check the login connection
 * @param {*} username 
 * @param {*} password 
 */
var checkLogin = function(username, password){
    return new Promise((resolve, reject) => {
        models.User.findOne({
            where:{
                username: username,
                password: password
            }
        }).then(user =>{
            resolve(user);
        }).catch((err)=>{
            reject(err.message);
        })
    });
}

exports.checkLogin = checkLogin;
exports.createUserWithZoneId = createUserWithZoneId;
exports.getUserByZoneId = getUserByZoneId;
exports.updateUserZoneId = updateUserZoneId;
exports.getAllUsersByRole = getAllUsersByRole;
exports.deleteUser = deleteUser;
exports.updateUserOnlyMail = updateUserOnlyMail;
exports.updateUser = updateUser;
exports.getAllUsers = getAllUsers;
exports.createUser = createUser;
exports.checkUsernameExists = checkUsernameExists;