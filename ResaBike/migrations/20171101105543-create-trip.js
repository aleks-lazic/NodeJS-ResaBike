'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Trips', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      departureHour: {
        type: Sequelize.DATETIME
      },
      idLine: {
        type: Sequelize.INT
      },
      idBooking: {
        type: Sequelize.INT
      },
      idDeparture: {
        type: Sequelize.INT
      },
      idTerminal: {
        type: Sequelize.INT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Trips');
  }
};