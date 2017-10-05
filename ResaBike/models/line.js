'use strict';
module.exports = (sequelize, DataTypes) => {
  var Line = sequelize.define('Line', {
    number: DataTypes.INTEGER
  });

  Line.associate = (models)=>{
    Line.belongsTo(models.Station);
    Line.hasOne(models.Zone);
    Line.belongsToMany(models.Station,{through: 'line_stations', foreignKey:'LineId'});
  }

  return Line;
};