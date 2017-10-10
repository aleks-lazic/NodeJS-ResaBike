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

var getZoneIdByName = function(name){
    return new Promise((resolve, reject) =>{
        models.Zone.findOne({
            where: {
                name: name
            }
        }).then((res)=> {
            resolve(res.id);
        }).catch((err) =>{
            reject(err.message);
        });
    })
}

exports.createZone = createZone;
exports.getZoneIdByName = getZoneIdByName;