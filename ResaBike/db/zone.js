var models = require('../models');

var createZone = function(id, zoneName){
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
            console.log(zones);
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

exports.createZone = createZone;
exports.getZoneIdByName = getZoneIdByName;
exports.getAllZones = getAllZones;
exports.getZoneById = getZoneById;