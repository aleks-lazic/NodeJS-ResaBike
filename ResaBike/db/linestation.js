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



exports.insertStationIdAndLineId = insertStationIdAndLineId;