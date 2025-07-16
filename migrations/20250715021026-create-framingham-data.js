'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FraminghamData', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4, // Generate UUID automatically
        primaryKey: true,
      },
      user: {
        type: Sequelize.STRING,
      },
      age: {
        type: Sequelize.INTEGER,
      },
      gender: {
        type: Sequelize.STRING,
      },
      totalCholesterol: {
        type: Sequelize.INTEGER,
      },
      hdlCholesterol: {
        type: Sequelize.INTEGER,
      },
      systolicBP: {
        type: Sequelize.INTEGER,
      },
      isSmoker: {
        type: Sequelize.BOOLEAN,
      },
      isDiabetic: {
        type: Sequelize.BOOLEAN,
      },
      riskScore: {
        type: Sequelize.FLOAT,
      },
      riskLevel: {
        type: Sequelize.STRING,
      },
      riskPercentage: {
        type: Sequelize.STRING, 
      },
      avgHeartRate: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      message: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FraminghamData');
  },
};