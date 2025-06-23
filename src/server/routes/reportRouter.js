const express = require('express');
const { getAllPieces, getMissing, getPoorCondition, getConditionSummary, getMusicByComposer, getPerformanceHistory } = require('../controllers/reportController.js');

const router = express.Router();

router.get('/all', (req, res) => {
    console.log("inside get route")
    const db = req.db;
    getAllPieces(req, res, db);
})

router.get('/missing', (req, res) => {
    const db = req.db;
    getMissing(req, res, db);
})

router.get('/poor-condition', (req, res) => {
    const db = req.db;
    getPoorCondition(req, res, db);
})

router.get('/condition-summary', (req, res) => {
    const db = req.db;
    getConditionSummary(req, res, db);
})

router.get('/music-by-composer', (req, res) => {
    const db = req.db;
    getMusicByComposer(req, res, db);
})

router.get('/performance-history', (req, res) => {
    const db = req.db;
    getPerformanceHistory(req, res, db);
})

module.exports = router;