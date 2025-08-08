const express = require('express');
const { 
  getAllPieces, 
  getMissing, 
  getPoorCondition, 
  getConditionSummary, 
  getMusicByComposer, 
  getPerformanceHistory 
} = require('../controllers/reportController.js');

const router = express.Router();

router.get('/all', (req, res, next) => {
  const db = req.db;
  getAllPieces(req, res, next, db);
});

router.get('/missing', (req, res, next) => {
  const db = req.db;
  getMissing(req, res, next, db);
});

router.get('/poor-condition', (req, res, next) => {
  const db = req.db;
  getPoorCondition(req, res, next, db);
});

router.get('/condition-summary', (req, res, next) => {
  const db = req.db;
  getConditionSummary(req, res, next, db);
});

router.get('/music-by-composer', (req, res, next) => {
  const db = req.db;
  getMusicByComposer(req, res, next, db);
});

router.get('/performance-history', (req, res, next) => {
  const db = req.db;
  getPerformanceHistory(req, res, next, db);
});

module.exports = router;
