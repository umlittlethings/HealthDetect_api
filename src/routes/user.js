const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { getAllUsers, getAllUsersFull, uploadSpreadsheet } = require('../controllers/userController');

router.get('/', getAllUsers);
router.get('/full', getAllUsersFull);
router.post('/upload', upload.single('file'), uploadSpreadsheet);

module.exports = router;