'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FraminghamData', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user: {
        type: Sequelize.STRING
      },
      age: {
        type: Sequelize.INTEGER
      },
      gender: {
        type: Sequelize.STRING
      },
      totalCholesterol: {
        type: Sequelize.INTEGER
      },
      hdlCholesterol: {
        type: Sequelize.INTEGER
      },
      systolicBP: {
        type: Sequelize.INTEGER
      },
      isSmoker: {
        type: Sequelize.BOOLEAN
      },
      isDiabetic: {
        type: Sequelize.BOOLEAN
      },
      riskScore: {
        type: Sequelize.FLOAT
      },
      riskLevel: {
        type: Sequelize.STRING
      },
      message: {
        type: Sequelize.STRING
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FraminghamData');
  }
};