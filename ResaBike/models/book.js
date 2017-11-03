'use strict';
module.exports = (sequelize, DataTypes) => {
  var Book = sequelize.define('Book', {
    time: DataTypes.STRING,
    token: DataTypes.TEXT,
    nbBike: DataTypes.INTEGER,
    mail: DataTypes.STRING,
    isConfirmed: DataTypes.BOOLEAN,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING 
  });

  Book.associate = (models)=>{

  }

  return Book;

};