var models = require('../models');

var createZone = function(zoneName){
    return new Promise((resolve, reject) => {
        models.Zone.create({
            name: zoneName
        }).then(() =>{
            console.log('Zone correctly created !');
            resolve();
        }).catch((err) =>{
            reject(err.message);
        });
    })
}

var upsertZone = function(name){
    return new Promise((resolve, reject) => {
        getZoneIdByName(name).then((id)=> {
            console.log(name + " already exists !");
            resolve();          
        }).catch(()=> {
            return createZone(name).then(() => {resolve();});                   
        })
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

exports.createZone = createZone;
exports.getZoneIdByName = getZoneIdByName;
exports.upsertZone = upsertZone;