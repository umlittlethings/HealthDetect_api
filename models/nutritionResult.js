'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class NutritionResult extends Model {
    static associate(models) {
      NutritionResult.belongsTo(models.NutritionData, {
        foreignKey: 'nutritionDataId',
        as: 'nutritionData',
      });
    }
  }

  NutritionResult.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      nutritionDataId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      bmi: DataTypes.FLOAT,
      bmiCategory: DataTypes.STRING,
      idealWeight: DataTypes.FLOAT,
      bmr: DataTypes.FLOAT,
      tee: DataTypes.FLOAT,
      proteinGram: DataTypes.FLOAT,
      proteinKcal: DataTypes.FLOAT,
      proteinPercent: DataTypes.FLOAT,
      fatGram: DataTypes.FLOAT,
      fatKcal: DataTypes.FLOAT,
      fatPercent: DataTypes.FLOAT,
      carbGram: DataTypes.FLOAT,
      carbKcal: DataTypes.FLOAT,
      carbPercent: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'NutritionResult',
      tableName: 'NutritionResult',
    }
  );

  return NutritionResult;
};