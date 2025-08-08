const express = require('express');
const {
  getMediumData,
  getComposerData,
  addComposer,
  getSpeciesData,
  getPublisherData,
} = require('../controllers/resourceController.js');

const router = express.Router();

router.get('/medium-data', (req, res, next) => {
    const db = req.db;
    getMediumData(req, res, next, db);
});

router.get('/composer-data', (req, res, next) => {
  const db = req.db;
  getComposerData(req, res, next, db);
});

router.get('/species-data', (req, res, next) => {
  const db = req.db;
  getSpeciesData(req, res, next, db);
});

router.get('/publisher-data', (req, res, next) => {
  const db = req.db;
  getPublisherData(req, res, next, db);
});

router.post('/composer-data', (req, res, next) => {
  const db = req.db;
  addComposer(req, res, next, db);
});

module.exports = router;
