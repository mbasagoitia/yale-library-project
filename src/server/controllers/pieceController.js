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
    // You will need to perform several joins to make sure all the necessary information is returned in the correct format
    // See PieceListItem.jsx
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
    console.log(req.body);
    const { title, opus, number, composer, medium, genre, publisher, callNumber, condition, publicDomain, notes, ownPhysical, ownDigital, missingParts } = req.body;
    const query = `
    INSERT INTO pieces (
        title, opus, number, composer_id, species_id, medium_id, publisher_id,
        call_number, condition_id, public_domain, additional_notes,
        own_physical, own_digital, missing_parts
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
     
    const values = [title, opus, number, composer.id, genre.id, medium.id, publisher.id, callNumber.join(" "), condition, publicDomain, notes, ownPhysical, ownDigital, missingParts ];
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