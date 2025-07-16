'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class FraminghamData extends Model {}

  FraminghamData.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user: DataTypes.STRING,
      age: DataTypes.INTEGER,
      gender: DataTypes.STRING,
      totalCholesterol: DataTypes.INTEGER,
      hdlCholesterol: DataTypes.INTEGER,
      systolicBP: DataTypes.INTEGER,
      isSmoker: DataTypes.BOOLEAN,
      isDiabetic: DataTypes.BOOLEAN,
      riskScore: DataTypes.FLOAT,
      riskLevel: DataTypes.STRING,
      riskPercentage: DataTypes.STRING, 
      message: DataTypes.STRING,
      avgHeartRate: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'FraminghamData',
    }
  );

  return FraminghamData;
};