const express = require('express');
const {
    getAllPieces,
    getSinglePiece,
    addNewPiece,
    editPiece,
    deletePiece
} = require('../controllers/pieceController.js');

const router = express.Router();

router.get('/', (req, res) => {
    const db = req.db;
    getAllPieces(req, res, db);
})

router.get('/:id', (req, res) => {
    const db = req.db;
    getSinglePiece(req, res, db);
})

router.post('/', (req, res) => {
    const db = req.db;
    addNewPiece(req, res, db);
})

router.put('/:id', (req, res) => {
    const db = req.db;
    editPiece(req, res, db);
})

router.delete('/:id', (req, res) => {
    const db = req.db;
    deletePiece(req, res, db);
})

module.exports = router;
