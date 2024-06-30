const getAllPieces = (req, res, db) => {
    const query = 'SELECT p.*, c.last_name AS last_name, c.first_name AS first_name, s.label AS genre, m.label AS medium, mc.label AS medium_category, pub.label AS publisher, con.label AS "condition" FROM pieces p JOIN composers c ON p.composer_id = c.id JOIN species_options s ON p.species_id = s.id JOIN medium_options m ON p.medium_id = m.id JOIN medium_category mc ON m.category_id = mc.id JOIN publisher_options pub ON p.publisher_id = pub.id JOIN conditions con ON p.condition_id = con.id;';
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
    const query = 'SELECT p.*, c.last_name AS last_name, c.first_name AS first_name, s.label AS genre, m.label AS medium, mc.label AS medium_category, pub.label AS publisher, con.label AS "condition" FROM pieces p JOIN composers c ON p.composer_id = c.id JOIN species_options s ON p.species_id = s.id JOIN medium_options m ON p.medium_id = m.id JOIN medium_category mc ON m.category_id = mc.id JOIN publisher_options pub ON p.publisher_id = pub.id JOIN conditions con ON p.condition_id = con.id WHERE p.id = ?;';
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
    const { title, identifierLabel, identifierValue, number, composer, medium, genre, publisher, callNumber, condition, publicDomain, notes, ownPhysical, ownDigital, missingParts, scansUrl } = req.body.info;
    const finalIdentifierValue = identifierValue === "" ? null : identifierValue;
    const mediumId = medium.id || medium.options[0].id;

    // This should probably be a separate middleware function
    const getFormattedDate = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = (`0${date.getMonth() + 1}`).slice(-2);
      const day = (`0${date.getDate()}`).slice(-2);
    
      return `${year}-${month}-${day}`;
    };

    const acquisitionDate = getFormattedDate();
    const query = `
    INSERT INTO pieces (
        title, identifier_label, identifier_value, number, composer_id, species_id, medium_id, publisher_id,
        call_number, condition_id, public_domain, additional_notes,
        own_physical, own_digital, missing_parts, scans_url, acquisition_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [title, identifierLabel, finalIdentifierValue, number, composer.id, genre.id, mediumId, publisher.id, callNumber.join(" "), condition, publicDomain, notes, ownPhysical, ownDigital, missingParts, scansUrl, acquisitionDate ];
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
  const { title, identifierLabel, identifierValue, number, composer, medium, genre, publisher, callNumber, condition, publicDomain, notes, ownPhysical, ownDigital, missingParts, scansUrl } = req.body.info;
  const finalIdentifierValue = identifierValue === "" ? null : identifierValue;
  const mediumId = medium.id || medium.options[0].id;

  const query = `
      UPDATE pieces
      SET title = ?, identifier_label = ?, identifier_value = ?, number = ?, composer_id = ?, species_id = ?, medium_id = ?,
          publisher_id = ?, call_number = ?, condition_id = ?, public_domain = ?, additional_notes = ?, own_physical = ?, own_digital = ?,
          missing_parts = ?, scans_url = ?
      WHERE ID = ?
  `;
  const values = [title, identifierLabel, finalIdentifierValue, number, composer.id, genre.id, mediumId, publisher.id, callNumber.join(" "), condition, publicDomain, notes, ownPhysical, ownDigital, missingParts, scansUrl, id];

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