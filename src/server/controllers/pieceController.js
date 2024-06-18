const getAllPieces = (req, res, db) => {
    const query = 'SELECT * FROM pieces';
    db.query(query, (err, rows) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          res.status(500).json({ error: 'Error retrieving piece list' });
          return;
        }
        res.status(200).json(rows);
      });
};

const getSinglePiece = (req, res, db) => {
    const { id } = req.params;
    const query = 'SELECT * FROM pieces WHERE ID = ?';
    db.query(query, [id], (err, rows) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          res.status(500).json({ error: 'Error retrieving piece' });
          return;
        }
        res.status(200).json(rows);
      });
};

const addNewPiece = (req, res, db) => {
    // Double check how the object is passed down
    const { title, opus, number, composer_id, species_id, medium_id, publisher_id, condition_id, public_domain, additional_notes, media_type_id, location_id } = req.data;
    const query = 'INSERT INTO pieces (title, opus, number, composer_id, species_id, medium_id, publisher_id, condition_id, public_domain, additional_notes, media_type_id, location_id) VALUES (? ? ? ? ? ? ? ? ? ? ? ?)';
    db.query(query, [title, opus, number, composer_id, species_id, medium_id, publisher_id, condition_id, public_domain, additional_notes, media_type_id, location_id ], (err, rows) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          res.status(500).json({ error: 'Error adding new piece' });
          return;
        }
        res.status(200).json(rows);
      });
};

// Think about how to implement the put and delete routes

module.exports = {
    getAllPieces,
    getSinglePiece,
    addNewPiece,
    editPiece,
    deletePiece
}