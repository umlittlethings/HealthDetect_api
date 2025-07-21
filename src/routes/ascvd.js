const express = require('express');
const router = express.Router();
const { getRiskByUser, updateRiskByUser, deleteRiskByUser } = require('../controllers/riskController');

router.get('/user', (req, res) => getRiskByUser({ ...req, query: { ...req.query, type: 'ascvd' } }, res));
router.put('/user', (req, res) => updateRiskByUser({ ...req, query: { ...req.query, type: 'ascvd' } }, res));
router.delete('/user', deleteRiskByUser);

module.exports = router;