const { getAllPiecesQuery,
        getPieceById,
        insertNewPiece,
        updatePieceById,
        deletePieceById
    } = require("../helpers/pieceHelpers.js");

const getAllPieces = (req, res, db) => {
  getAllPiecesQuery(db, (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Error retrieving piece list' });
      return;
    }
    res.status(200).json(result);
  });
};

const getSinglePiece = (req, res, db) => {
  const { id } = req.params;

  getPieceById(id, db, (err, piece) => {
    if (err) {
      console.error('Error fetching piece:', err);
      res.status(500).json({ error: 'Error retrieving piece' });
      return;
    }
    res.status(200).json(piece);
  });
};

const addNewPiece = (req, res, db) => {
  const pieceInfo = req.body.info;

  insertNewPiece(pieceInfo, db, (err, result) => {
    if (err) {
      console.error('Error inserting piece:', err);
      res.status(500).json({ error: 'Error adding new piece' });
      return;
    }

    const newId = result.insertId;

    getPieceById(newId, db, (err2, fullPiece) => {
      if (err2) {
        console.error('Error retrieving new piece:', err2);
        res.status(500).json({ error: 'Piece added but retrieval failed' });
        return;
      }

      res.status(201).json(fullPiece);
    });
  });
};

const editPiece = (req, res, db) => {
  const { id } = req.params;
  const pieceInfo = req.body.info;

  updatePieceById(id, pieceInfo, db, (err, result) => {
    if (err) {
      console.error('Error executing UPDATE query:', err);
      res.status(500).json({ error: 'Error updating piece' });
      return;
    }

    getPieceById(id, db, (err2, updatedPiece) => {
      if (err2) {
        console.error('Error retrieving updated piece:', err2);
        res.status(500).json({ error: 'Piece updated but retrieval failed' });
        return;
      }

      res.status(200).json(updatedPiece);
    });
  });
};

const deletePiece = (req, res, db) => {
  const { id } = req.params;
  getPieceById(id, db, (fetchErr, pieceToDelete) => {
    if (fetchErr) {
      console.error('Error retrieving piece before deletion:', fetchErr);
      res.status(500).json({ error: 'Error retrieving piece to delete' });
      return;
    }
    if (!pieceToDelete) {
      res.status(404).json({ error: 'Piece not found' });
      return;
    }
    deletePieceById(id, db, (deleteErr, result) => {
      if (deleteErr) {
        console.error('Error deleting piece:', deleteErr);
        res.status(500).json({ error: 'Error deleting piece' });
        return;
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
}