'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('NutritionResult', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      nutritionDataId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'NutritionData',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      bmi: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      bmiCategory: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      idealWeight: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      bmr: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      tee: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      proteinGram: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      proteinKcal: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      proteinPercent: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      fatGram: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      fatKcal: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      fatPercent: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      carbGram: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      carbKcal: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      carbPercent: {
        type: Sequelize.FLOAT,
        allowNull: false,
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
    await queryInterface.dropTable('NutritionResult');
  },
};