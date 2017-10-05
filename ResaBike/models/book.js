'use strict';
module.exports = (sequelize, DataTypes) => {
  var Book = sequelize.define('Book', {
    idDeparture: DataTypes.INTEGER,
    idArrival: DataTypes.INTEGER,
    time: DataTypes.DATE,
    token: DataTypes.TEXT,
    nbBike: DataTypes.INTEGER
  });
  return Book;
};