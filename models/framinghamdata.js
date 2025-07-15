'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FraminghamData extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FraminghamData.init({
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
    message: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'FraminghamData',
  });
  return FraminghamData;
};