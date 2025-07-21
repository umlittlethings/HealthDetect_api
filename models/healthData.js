'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class HealthData extends Model {
    static associate(models) {
      // HealthData belongs to User
      HealthData.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
      
      // HealthData has many risk assessments
      HealthData.hasMany(models.RiskAssessment, {
        foreignKey: 'healthDataId',
        as: 'riskAssessments',
        onDelete: 'CASCADE',
      });
    }
  }

  HealthData.init(
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
      totalCholesterol: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 100,
          max: 400,
        },
      },
      hdlCholesterol: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 20,
          max: 100,
        },
      },
      systolicBP: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 80,
          max: 200,
        },
      },
      isSmoker: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isDiabetic: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      avgHeartRate: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
          min: 40,
          max: 200,
        },
      },
      race: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'HealthData',
      tableName: 'HealthData',
    }
  );

  return HealthData;
};