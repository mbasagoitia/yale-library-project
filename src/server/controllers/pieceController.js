const {
  getAllPiecesQuery,
  getPieceById,
  insertNewPiece,
  updatePieceById,
  deletePieceById
} = require('../helpers/pieceHelpers');

async function getAllPieces(req, res, next) {
  try {
    const rows = await getAllPiecesQuery(req.db);
    res.status(200).json(rows);
  } catch (err) {
    err.status = 500;
    err.message = 'Error retrieving piece list';
    next(err);
  }
}

async function getSinglePiece(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid ID format' });

    const piece = await getPieceById(id, req.db);
    if (!piece) return res.status(404).json({ error: 'Piece not found' });

    res.status(200).json(piece);
  } catch (err) {
    err.status = err.status || 500;
    err.message = err.message || 'Error retrieving piece';
    next(err);
  }
}

async function addNewPiece(req, res, next) {
  try {
    const pieceInfo = req.body.info || {};
    const newId = await insertNewPiece(pieceInfo, req.db);

    const fullPiece = await getPieceById(newId, req.db);
    if (!fullPiece) return res.status(500).json({ error: 'Piece added but retrieval failed' });

    res.status(201).json(fullPiece);
  } catch (err) {
    err.status = err.status || 500;
    err.message = err.message || 'Error adding new piece';
    next(err);
  }
}

async function editPiece(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid ID format' });

    const pieceInfo = req.body.info || {};
    const updated = await updatePieceById(id, pieceInfo, req.db);

    if (!updated) return res.status(404).json({ error: 'Piece not found' });

    const updatedPiece = await getPieceById(id, req.db);
    if (!updatedPiece) return res.status(500).json({ error: 'Piece updated but retrieval failed' });

    res.status(200).json(updatedPiece);
  } catch (err) {
    err.status = err.status || 500;
    err.message = err.message || 'Error updating piece';
    next(err);
  }
}

async function deletePiece(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid ID format' });

    const piece = await getPieceById(id, req.db);
    if (!piece) return res.status(404).json({ error: 'Piece not found' });

    const deleted = await deletePieceById(id, req.db);
    if (!deleted) return res.status(500).json({ error: 'Error deleting piece' });

    res.status(200).json(piece);
  } catch (err) {
    err.status = err.status || 500;
    err.message = err.message || 'Error deleting piece';
    next(err);
  }
}

module.exports = {
  getAllPieces,
  getSinglePiece,
  addNewPiece,
  editPiece,
  deletePiece
};
