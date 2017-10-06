'use strict';
module.exports = (sequelize, DataTypes) => {
  var Zone = sequelize.define('Zone', {
    name: DataTypes.STRING
  });
  
  Zone.associate = (models)=>{
    Zone.hasOne(models.User);
    Zone.hasOne(models.Line);
  }
  
  return Zone;

};