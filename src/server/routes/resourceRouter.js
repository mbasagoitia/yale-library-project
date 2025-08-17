const express = require('express');
const {
  getMediumData,
  getComposerData,
  addComposer,
  getSpeciesData,
  getPublisherData,
} = require('../controllers/resourceController');

const router = express.Router();

router.get('/medium-data',    getMediumData);
router.get('/composer-data',  getComposerData);
router.post('/composer-data', addComposer);
router.get('/species-data',   getSpeciesData);
router.get('/publisher-data', getPublisherData);

module.exports = router;
