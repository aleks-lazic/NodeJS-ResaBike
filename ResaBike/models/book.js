'use strict';
module.exports = (sequelize, DataTypes) => {
  var Book = sequelize.define('Book', {
    time: DataTypes.DATE,
    token: DataTypes.TEXT,
    nbBike: DataTypes.INTEGER
  });

  Book.associate = (models)=>{
    Book.belongsTo(models.Station);
  }

  return Book;

};