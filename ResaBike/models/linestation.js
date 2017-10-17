'use strict';
module.exports = (sequelize, DataTypes) => {
  var LineStation = sequelize.define('LineStation', {
    position: DataTypes.INTEGER,
    isDepOrTer: DataTypes.BOOLEAN
  });

  LineStation.associate = (models) =>{
    LineStation.belongsTo(models.Station);
    LineStation.belongsTo(models.Line);
  }

  return LineStation;
}