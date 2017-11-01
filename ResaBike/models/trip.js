'use strict';
module.exports = (sequelize, DataTypes) => {
  var Trip = sequelize.define('Trip', {
    departureHour: DataTypes.STRING,
    idLine: DataTypes.INTEGER,
    idBooking: DataTypes.INTEGER,
    idDeparture: DataTypes.INTEGER,
    idTerminal: DataTypes.INTEGER
  });

    return Trip;
};