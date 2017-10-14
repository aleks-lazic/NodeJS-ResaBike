'use strict';
module.exports = (sequelize, DataTypes) => {
  var Line = sequelize.define('Line', {
    
  });

  Line.associate = (models)=>{
    Line.belongsTo(models.Zone);
    Line.hasOne(models.LineStation);    
  }

  return Line;
};