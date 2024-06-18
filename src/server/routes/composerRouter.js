const express = require('express');
const { getComposerData } = require('../controllers/composerController.js');

const router = express.Router();

router.get('/composer-data', (req, res) => {
    const db = req.db;
    getComposerData(req, res, db);
  });

module.exports = router;
