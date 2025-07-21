'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RiskAssessments', {
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
      healthDataId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'HealthData',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      framinghamScore: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      framinghamLevel: {
        type: Sequelize.ENUM('low', 'medium', 'high'),
        allowNull: false,
      },
      framinghamPercentage: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ascvdScore: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      ascvdLevel: {
        type: Sequelize.ENUM('low', 'medium', 'high'),
        allowNull: true,
      },
      ascvdMessage: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      framinghamMessage: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      assessmentDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
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
    await queryInterface.dropTable('RiskAssessments');
  },
};