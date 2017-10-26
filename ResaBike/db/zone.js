var models = require('../models');

var upsertZone = function(id, zoneName){
    return new Promise((resolve, reject) => {  
        models.Zone.upsert({
            id: id,
            name: zoneName
        }).then(() =>{
            resolve();
        }).catch((err) =>{
            reject(err.message);
        });
    })
}

var createZone = function(zoneName){
    return new Promise((resolve, reject) => {  
        models.Zone.create({
            name: zoneName
        }).then((zone) =>{
            resolve(zone.id);
        }).catch((err) =>{
            reject(err.message);
        });
    })
}

var getZoneIdByName = function(name){
    return new Promise((resolve, reject) =>{
        models.Zone.findOne({
            where: {
                name: name
            }
        }).then((res)=> {
            resolve(res.id);
        }).catch((err) =>{
            reject("null");
        });
    })
}

var getAllZones = function(){
    return new Promise((resolve, reject) => {
        models.Zone.findAll({
        }).then(zones =>{
            resolve(zones);
        }).catch((err)=>{
            reject(err.message);

        })    
    })
}

var getZoneById = function(id) {
    return new Promise((resolve, reject) => {
        models.Zone.findOne({
            where: {
                id: id
            }
        }).then(zone =>{
            resolve(zone);
        }).catch((err)=>{
            reject(err.message);

        })    
    })
}

var updateZoneById = function(id, name){
    return new Promise((resolve, reject) => {
        models.Zone.update({
            name: name
            },
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

var deleteZone = function(id) {
    return new Promise((resolve, reject) => {
        models.Zone.destroy({
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

exports.deleteZone = deleteZone;
exports.updateZoneById = updateZoneById;
exports.upsertZone = upsertZone;
exports.createZone = createZone;
exports.getZoneIdByName = getZoneIdByName;
exports.getAllZones = getAllZones;
exports.getZoneById = getZoneById;