'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('HealthData', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      totalCholesterol: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      hdlCholesterol: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      systolicBP: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      isSmoker: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isDiabetic: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      avgHeartRate: {
        type: Sequelize.FLOAT,
        allowNull: true,
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
    await queryInterface.dropTable('HealthData');
  },
};