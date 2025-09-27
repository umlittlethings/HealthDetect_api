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
      NutritionData.associate = function(models) {
      NutritionData.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      NutritionData.hasOne(models.NutritionResult, { foreignKey: 'nutritionDataId', as: 'result' });
};
    }
  }

  NutritionData.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      gender: {
        type: DataTypes.ENUM('male', 'female'),
        allowNull: false
      },
      weight: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      height: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      activityLevel: {
        type: DataTypes.ENUM('bedrest', 'ringan', 'sedang', 'berat'),
        allowNull: true
      },
      stressLevel: {
        type: DataTypes.ENUM('ringan', 'sedang', 'berat'),
        allowNull: true
      },
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