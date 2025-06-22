const express = require('express');
const { validateTicket } = require('../controllers/authController');

const router = express.Router();

router.get('/validate-ticket', validateTicket);

module.exports = router;
