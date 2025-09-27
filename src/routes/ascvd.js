const express = require('express');
const router = express.Router();
const { calculateFraminghamHandler, getRiskByUser, updateRiskByUser, deleteRiskByUser } = require('../controllers/riskController');

router.post('/', calculateFraminghamHandler); // Sama seperti Framingham karena menggunakan service yang sama
router.get('/user', (req, res) => getRiskByUser({ ...req, query: { ...req.query, type: 'ascvd' } }, res));
router.put('/user', (req, res) => updateRiskByUser({ ...req, query: { ...req.query, type: 'ascvd' } }, res));
router.delete('/user', deleteRiskByUser);

module.exports = router;