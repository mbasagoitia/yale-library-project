const express = require('express');
const {
  getMediumData,
  getSingleMediumData,
  getComposerData,
  getSingleComposerData,
  addComposer,
  getSpeciesData,
  getSingleSpeciesData,
  getPublisherData,
  getSinglePublisherData
} = require('../controllers/resourceController.js');

const router = express.Router();

router.get('/medium-data', (req, res) => {
    const db = req.db;
    getMediumData(req, res, db);
});

router.get('/medium-data/:id', (req, res) => {
    const db = req.db;
    getSingleMediumData(req, res, db);
});

router.get('/composer-data', (req, res) => {
  const db = req.db;
  getComposerData(req, res, db);
});

router.get('/composer-data/:id', (req, res) => {
  const db = req.db;
  getSingleComposerData(req, res, db);
});

router.get('/species-data', (req, res) => {
  const db = req.db;
  getSpeciesData(req, res, db);
});

router.get('/species-data/:id', (req, res) => {
  const db = req.db;
  getSingleSpeciesData(req, res, db);
});

router.get('/publisher-data', (req, res) => {
  const db = req.db;
  getPublisherData(req, res, db);
});

router.get('/publisher-data/:id', (req, res) => {
  const db = req.db;
  getSinglePublisherData(req, res, db);
});

router.post('/composer-data', (req, res) => {
  const db = req.db;
  addComposer(req, res, db);
});

module.exports = router;
