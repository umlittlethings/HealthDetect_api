const express = require('express');
const router = express.Router();
const { calculateFraminghamHandler } = require('../controllers/framinghamcontroller');

router.post('/', calculateFraminghamHandler);

module.exports = router;