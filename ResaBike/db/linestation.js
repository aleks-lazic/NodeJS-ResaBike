var models = require('../models');

var insertStationIdAndLineId = function(stationId, lineId, position){
    models.LineStation.create({
        LineId: lineId,
        StationId: stationId,
        postion: position
    }).then(() =>{
        console.log('Relation between station and line added');
    }).catch((err) =>{
        reject(err.message);
    });
}


exports.insertStationIdAndLineId = insertStationIdAndLineId;