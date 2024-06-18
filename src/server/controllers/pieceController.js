const getAllPieces = (req, res, db) => {
    const query = 'SELECT * FROM pieces';
    db.query(query, (err, result) => {
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
    const query = 'SELECT * FROM pieces WHERE ID = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          res.status(500).json({ error: 'Error retrieving piece' });
          return;
        }
        res.status(200).json(result);
      });
};

const addNewPiece = (req, res, db) => {
    // Double check how the object is passed down
    const { title, opus, number, composer_id, species_id, medium_id, publisher_id, condition_id, public_domain, additional_notes, media_type_id, location_id } = req.data;
    const query = 'INSERT INTO pieces (title, opus, number, composer_id, species_id, medium_id, publisher_id, condition_id, public_domain, additional_notes, media_type_id, location_id) VALUES (? ? ? ? ? ? ? ? ? ? ? ?)';
    const values = [title, opus, number, composer_id, species_id, medium_id, publisher_id, condition_id, public_domain, additional_notes, media_type_id, location_id ];
    db.query(query, values, (err, result) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          res.status(500).json({ error: 'Error adding new piece' });
          return;
        }
        res.status(200).json(result);
      });
};

const editPiece = (req, res, db) => {
  const { id } = req.params;
  const { title, opus, number, composer_id, species_id, medium_id, publisher_id, condition_id, public_domain, additional_notes, media_type_id, location_id } = req.body;

  const query = `
      UPDATE pieces
      SET title = ?, opus = ?, number = ?, composer_id = ?, species_id = ?, medium_id = ?,
          publisher_id = ?, condition_id = ?, public_domain = ?, additional_notes = ?,
          media_type_id = ?, location_id = ?
      WHERE ID = ?
  `;
  const values = [title, opus, number, composer_id, species_id, medium_id, publisher_id, condition_id, public_domain, additional_notes, media_type_id, location_id, id];

  db.query(query, values, (err, result) => {
      if (err) {
          console.error('Error executing MySQL query:', err);
          res.status(500).json({ error: 'Error updating piece' });
          return;
      }

      res.status(200).json({ message: 'Piece updated successfully' });
  });
};

const deletePiece = (req, res, db) => {
  const { id } = req.params;
  const query = 'DELETE FROM pieces WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Error updating piece' });
        return;
    }
    res.status(200).json({ message: 'Piece deleted successfully' });
  })
}

module.exports = {
    getAllPieces,
    getSinglePiece,
    addNewPiece,
    editPiece,
    deletePiece
}