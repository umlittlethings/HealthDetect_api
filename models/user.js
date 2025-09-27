'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // User has many health data records
      User.hasMany(models.HealthData, {
        foreignKey: 'userId',
        as: 'healthData',
        onDelete: 'CASCADE',
      });
      
      // User has many risk assessments
      User.hasMany(models.RiskAssessment, {
        foreignKey: 'userId',
        as: 'riskAssessments',
        onDelete: 'CASCADE',
      });

      User.hasMany(models.NutritionData, { as: 'nutritionData', foreignKey: 'userId' });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 100],
        },
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 18,
          max: 120,
        },
      },
      gender: {
        type: DataTypes.ENUM('male', 'female'),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
    }
  );

  return User;
};