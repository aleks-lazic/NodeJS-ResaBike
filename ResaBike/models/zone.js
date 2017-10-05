'use strict';
module.exports = (sequelize, DataTypes) => {
  var Zone = sequelize.define('Zone', {
    name: DataTypes.STRING
  });
  return Zone;
};