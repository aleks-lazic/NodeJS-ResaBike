'use strict';
module.exports = (sequelize, DataTypes) => {
  var Station = sequelize.define('Station', {
    name: DataTypes.STRING
  });

  Station.associate = (models) =>{
    Station.hasOne(models.Book,{as:'DepartureStation', foreignKey:'DepartureId'});
    Station.hasOne(models.Book,{as:'ArrivalStation', foreignKey:'ArrivalId'});
    Station.hasOne(models.Line,{as:'LineDepartureStation', foreignKey:'DepartureId'});
    Station.hasOne(models.Line,{as:'LineArrivalStation', foreignKey:'ArrivalId'});
    Station.hasOne(models.LineStation);
  }

  return Station;

};