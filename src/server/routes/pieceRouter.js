const express = require('express');
const {
    getAllPieces,
    getSinglePiece,
    addNewPiece,
    editPiece,
    deletePiece
} = require('../controllers/pieceController.js');

const router = express.Router();

router.get('/', (req, res, next) => {
    const db = req.db;
    getAllPieces(req, res, next, db);
});

router.get('/:id', (req, res, next) => {
    const db = req.db;
    getSinglePiece(req, res, next, db);
});

router.post('/', (req, res, next) => {
    const db = req.db;
    addNewPiece(req, res, next, db);
});

router.put('/:id', (req, res, next) => {
    const db = req.db;
    editPiece(req, res, next, db);
});

router.delete('/:id', (req, res, next) => {
    const db = req.db;
    deletePiece(req, res, next, db);
});

module.exports = router;
