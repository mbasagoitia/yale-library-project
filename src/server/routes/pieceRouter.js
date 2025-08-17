const express = require('express');
const {
  getAllPieces,
  getSinglePiece,
  addNewPiece,
  editPiece,
  deletePiece
} = require('../controllers/pieceController');

const router = express.Router();

router.get('/', getAllPieces);
router.get('/:id', getSinglePiece);
router.post('/', addNewPiece);
router.put('/:id', editPiece);
router.delete('/:id', deletePiece);

module.exports = router;
