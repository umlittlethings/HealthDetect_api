'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class NutritionData extends Model {
    static associate(models) {
      NutritionData.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
      NutritionData.hasOne(models.NutritionResult, {
        foreignKey: 'nutritionDataId',
        as: 'result',
        onDelete: 'CASCADE',
      });
    }
  }

  NutritionData.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      age: DataTypes.INTEGER,
      gender: DataTypes.ENUM('male', 'female'),
      weight: DataTypes.FLOAT,
      height: DataTypes.FLOAT,
      activityLevel: DataTypes.ENUM('bedrest', 'ringan', 'sedang', 'berat'),
      stressLevel: DataTypes.ENUM('ringan', 'sedang', 'berat'),
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'NutritionData',
      tableName: 'NutritionData',
    }
  );

  return NutritionData;
};