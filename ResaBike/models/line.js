'use strict';
module.exports = (sequelize, DataTypes) => {
  var Line = sequelize.define('Line', {
    number: DataTypes.INTEGER
  });
  return Line;
};