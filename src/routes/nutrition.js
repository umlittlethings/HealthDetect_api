const express = require('express');
const router = express.Router();
const { createNutrition, getNutritionResult } = require('../controllers/nutritionContoller');

router.post('/', createNutrition);
router.get('/result', getNutritionResult);

module.exports = router;