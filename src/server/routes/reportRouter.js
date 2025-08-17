const express = require('express');
const {
  getAllPieces,
  getMissing,
  getPoorCondition,
  getConditionSummary,
  getMusicByComposer,
  getPerformanceHistory,
} = require('../controllers/reportController');

const router = express.Router();

router.get('/all',                 getAllPieces);
router.get('/missing',             getMissing);
router.get('/poor-condition',      getPoorCondition);
router.get('/condition-summary',   getConditionSummary);
router.get('/music-by-composer',   getMusicByComposer);
router.get('/performance-history', getPerformanceHistory);

module.exports = router;
