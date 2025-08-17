const express = require('express');
const { addNewAdmin } = require('../controllers/adminController');

const router = express.Router();
router.post('/', addNewAdmin);

module.exports = router;