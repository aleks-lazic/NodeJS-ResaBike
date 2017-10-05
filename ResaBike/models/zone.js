'use strict';
module.exports = (sequelize, DataTypes) => {
  var Zone = sequelize.define('Zone', {
    name: DataTypes.STRING
  });
  
  Zone.associate = (models)=>{
    Zone.hasOne(models.User);
    Zone.belongsTo(models.Line);
  }
  
  return Zone;

};