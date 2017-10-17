var models = require('../models');

var insertStationIdAndLineId = function(stationId, lineId, position){
    models.LineStation.create({
        LineId: lineId,
        StationId: stationId,
        position: position
    }).then(() =>{
        console.log('Relation between station and line added');
    }).catch((err) =>{
        console.log(err.message);
    });
}

var getAllStationsWithIdLine = function(idLine){
    return new Promise((resolve, reject) => {
        models.LineStation.findAll({
            where: {
                LineId: idLine
            },
            attributes: ['position', 'StationId']
        }).then((res)=> {
            resolve(res);
        }).catch((err) => {
            reject(err.message);
        });
    })
}



exports.insertStationIdAndLineId = insertStationIdAndLineId;
exports.getAllStationsWithIdLine = getAllStationsWithIdLine;