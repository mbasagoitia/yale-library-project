const express = require('express');
const { getComposerData } = require('../controllers/composerController.js');

const router = express.Router();

router.get('/composer-data', getComposerData);

module.exports = router;
