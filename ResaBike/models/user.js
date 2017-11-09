'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.TEXT,
    mail: DataTypes.STRING
  });

  User.associate = (models) =>{
    User.belongsTo(models.Role);
    User.belongsTo(models.Zone);
  }

  return User;

};