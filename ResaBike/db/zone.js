var models = require('../models');

/**
 * Insertion of a zone if the zone already exists update it
 * @param {*} id 
 * @param {*} zoneName 
 */
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
/**
 * Create a zone in the database
 * @param {*} zoneName 
 */
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
/**
 * Retrieve a zone id using its name
 * @param {*} name 
 */
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

/**
 * Retrieve all the zones
 */
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
/**
 * Retrieve a zone using its id
 * @param {*} id 
 */
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

/**
 * Update a zone using its id
 * @param {*} id 
 * @param {*} name 
 */
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

/**
 * Delete a zone using its id
 * @param {*} id 
 */
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