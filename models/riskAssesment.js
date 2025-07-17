'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class RiskAssessment extends Model {
    static associate(models) {
      // RiskAssessment belongs to User
      RiskAssessment.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
      
      // RiskAssessment belongs to HealthData
      RiskAssessment.belongsTo(models.HealthData, {
        foreignKey: 'healthDataId',
        as: 'healthData',
      });
    }
  }

  RiskAssessment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      healthDataId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      riskScore: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
          max: 100,
        },
      },
      riskLevel: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        allowNull: false,
      },
      riskPercentage: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      assessmentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'RiskAssessment',
      tableName: 'RiskAssessments',
    }
  );

  return RiskAssessment;
};