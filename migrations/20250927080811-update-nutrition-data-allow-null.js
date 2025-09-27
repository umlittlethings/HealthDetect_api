'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('NutritionData', 'weight', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.changeColumn('NutritionData', 'height', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.changeColumn('NutritionData', 'activityLevel', {
      type: Sequelize.ENUM('bedrest', 'ringan', 'sedang', 'berat'),
      allowNull: true,
    });
    await queryInterface.changeColumn('NutritionData', 'stressLevel', {
      type: Sequelize.ENUM('ringan', 'sedang', 'berat'),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('NutritionData', 'weight', {
      type: Sequelize.FLOAT,
      allowNull: false,
    });
    await queryInterface.changeColumn('NutritionData', 'height', {
      type: Sequelize.FLOAT,
      allowNull: false,
    });
    await queryInterface.changeColumn('NutritionData', 'activityLevel', {
      type: Sequelize.ENUM('bedrest', 'ringan', 'sedang', 'berat'),
      allowNull: false,
    });
    await queryInterface.changeColumn('NutritionData', 'stressLevel', {
      type: Sequelize.ENUM('ringan', 'sedang', 'berat'),
      allowNull: false,
    });
  }
};