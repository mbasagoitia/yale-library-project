const { getAllPiecesQuery,
  getPieceById,
  insertNewPiece,
  updatePieceById,
  deletePieceById
} = require("../helpers/pieceHelpers.js");

const getAllPieces = (req, res, next) => {
  const db = req.db;

  getAllPiecesQuery(db, (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      const error = new Error('Error retrieving piece list');
      error.status = 500;
      return next(error);
    }
    res.status(200).json(result);
  });
};

const getSinglePiece = (req, res, next) => {
  const { id } = req.params;
  const db = req.db;

  getPieceById(id, db, (err, piece) => {
    if (err) {
      console.error('Error fetching piece:', err);
      const error = new Error('Error retrieving piece');
      error.status = 500;
      return next(error);
    }
    res.status(200).json(piece);
  });
};

const addNewPiece = (req, res, next) => {
  const pieceInfo = req.body.info;
  const db = req.db;

  insertNewPiece(pieceInfo, db, (err, result) => {
    if (err) {
      console.error('Error inserting piece:', err);
      const error = new Error('Error adding new piece');
      error.status = 500;
      return next(error); 
    }

    const newId = result.insertId;

    getPieceById(newId, db, (err2, fullPiece) => {
      if (err2) {
        console.error('Error retrieving new piece:', err2);
        const error = new Error('Piece added but retrieval failed');
        error.status = 500;
        return next(error); 
      }

      res.status(201).json(fullPiece);
    });
  });
};

const editPiece = (req, res, next) => {
  const { id } = req.params;
  const pieceInfo = req.body.info;
  const db = req.db;

  updatePieceById(id, pieceInfo, db, (err, result) => {
    if (err) {
      console.error('Error executing UPDATE query:', err);
      const error = new Error('Error updating piece');
      error.status = 500;
      return next(error);
    }

    getPieceById(id, db, (err2, updatedPiece) => {
      if (err2) {
        console.error('Error retrieving updated piece:', err2);
        const error = new Error('Piece updated but retrieval failed');
        error.status = 500;
        return next(error);
      }

      res.status(200).json(updatedPiece);
    });
  });
};

const deletePiece = (req, res, next) => {
  const { id } = req.params;
  const db = req.db;

  getPieceById(id, db, (fetchErr, pieceToDelete) => {
    if (fetchErr) {
      console.error('Error retrieving piece before deletion:', fetchErr);
      const error = new Error('Error retrieving piece to delete');
      error.status = 500;
      return next(error);
    }
    if (!pieceToDelete) {
      const error = new Error('Piece not found');
      error.status = 404;
      return next(error);
    }

    deletePieceById(id, db, (deleteErr, result) => {
      if (deleteErr) {
        console.error('Error deleting piece:', deleteErr);
        const error = new Error('Error deleting piece');
        error.status = 500;
        return next(error);
      }

      res.status(200).json(pieceToDelete);
    });
  });
};

module.exports = {
  getAllPieces,
  getSinglePiece,
  addNewPiece,
  editPiece,
  deletePiece
};
