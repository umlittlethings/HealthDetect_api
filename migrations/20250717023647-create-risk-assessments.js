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
      riskScore: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      riskLevel: {
        type: Sequelize.ENUM('low', 'medium', 'high'),
        allowNull: false,
      },
      riskPercentage: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      message: {
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