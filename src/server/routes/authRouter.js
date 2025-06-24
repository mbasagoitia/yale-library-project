const express = require('express');
const { validateTicket, renewToken } = require('../controllers/authController.js');
const authenticateToken = require("../middlewares/authenticateToken.js");

const router = express.Router();

router.get('/validate-ticket', validateTicket);

router.post('/renew-token', authenticateToken, renewToken);

module.exports = router;
