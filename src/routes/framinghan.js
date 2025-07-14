const express = require('express');
const router = express.Router();
const { calculateFraminghamHandler } = require('../controllers/framinghamController');

router.post('/', calculateFraminghamHandler);

module.exports = router;