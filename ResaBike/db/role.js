var models = require('../models');


var getAllRoles = function(){
    return new Promise((resolve, reject)=>{
        models.Role.findAll({
            attributes: ['name']
        }).then(roles =>{
            resolve(roles);
        }).catch((err)=>{
            reject(err.message);
        })
    })
}

var getRoleNameById = function(id){
    return new Promise((resolve, reject)=>{
        models.Role.findOne({
            where:{
                id: id
            },
            attributes: ['name']
        }).then(role =>{
            resolve(role.name);
        }).catch((err)=>{
            reject(err.message);
        })
    })
}

var getIdRoleByName = function(name){
    return new Promise((resolve, reject)=>{
        models.Role.findOne({
            where:{
                name: name
            },
            attributes: ['id']
        }).then(role =>{
            resolve(role.id);
        }).catch((err)=>{
            reject(err.message);
        })
    })
}

var createRole = function(id, name){
    return new Promise((resolve, reject)=>{
        models.Role.create({
            id: id,
            name: name
        }).then(role =>{
            resolve(role.id);
        }).catch((err)=>{
            reject(err.message);
        })
    })
}
exports.createRole = createRole;
exports.getRoleNameById = getRoleNameById;
exports.getIdRoleByName = getIdRoleByName;
exports.getAllRoles = getAllRoles;