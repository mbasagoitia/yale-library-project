const express = require('express');
const { getMediumData, getPublisherData, getSpeciesData } = require('../controllers/resourceController.js');

const router = express.Router();

router.get('/medium-data', (req, res) => {
    const db = req.db;
    getMediumData(req, res, db);
});

router.get('/publisher-data', (req, res) => {
  const db = req.db;
  getPublisherData(req, res, db);
});

router.get('/species-data', (req, res) => {
  const db = req.db;
  getSpeciesData(req, res, db);
});

module.exports = router;
