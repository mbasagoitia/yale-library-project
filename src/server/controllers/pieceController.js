const getAllPieces = (req, res, db) => {
    // This is now returning all the data. Do we need to include medium category id and parent ids for filtering purposes later?
    const query = 'SELECT p.*, c.last_name AS last_name, c.first_name AS first_name, s.label AS genre, m.label AS medium, COALESCE(mc.label, mo_parent.label) AS medium_category, pub.label AS publisher, con.label AS "condition" FROM pieces p JOIN composers c ON p.composer_id = c.id JOIN species_options s ON p.species_id = s.id JOIN medium_options m ON p.medium_id = m.id LEFT JOIN medium_category mc ON m.category_id = mc.id LEFT JOIN medium_options mo_parent ON m.category_id = 66 AND m.category_id = mo_parent.value JOIN publisher_options pub ON p.publisher_id = pub.id JOIN conditions con ON p.condition_id = con.id ORDER BY p.id';
    db.query(query, (err, result) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          res.status(500).json({ error: 'Error retrieving piece list' });
          return;
        }
        console.log(result.length);
        res.status(200).json(result);
      });
};

const getSinglePiece = (req, res, db) => {
  const { id } = req.params;
  const query = `
    SELECT p.*, 
           c.last_name AS composerLastName, 
           c.first_name AS composerFirstName, 
           s.label AS genre, 
           m.label AS medium, 
           COALESCE(mc.label, mo_parent.label) AS mediumCategory, 
           pub.label AS publisher, 
           con.label AS \`condition\`
    FROM pieces p
    JOIN composers c ON p.composer_id = c.id
    JOIN species_options s ON p.species_id = s.id
    JOIN medium_options m ON p.medium_id = m.id
    LEFT JOIN medium_category mc ON m.category_id = mc.id
    LEFT JOIN medium_options mo_parent ON m.category_id = 66 AND m.category_id = mo_parent.value
    JOIN publisher_options pub ON p.publisher_id = pub.id
    JOIN conditions con ON p.condition_id = con.id
    WHERE p.id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Error retrieving piece' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Piece not found' });
      return;
    }
    res.status(200).json(results[0]);
  });
};


const addNewPiece = (req, res, db) => {
  const {
    title,
    identifierLabel,
    identifierValue,
    number,
    composer,
    medium,
    genre,
    publisher,
    callNumber,
    condition,
    publicDomain,
    notes,
    ownPhysical,
    ownDigital,
    missingParts,
    scansUrl
  } = req.body.info;

  const finalIdentifierValue = identifierValue === "" ? null : identifierValue;
  const mediumId = medium.id || medium.options[0].id;
  const finalIdentifierLabel = !identifierValue ? null : identifierLabel;

  const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const acquisitionDate = getFormattedDate();

  const insertQuery = `
    INSERT INTO pieces (
      title, identifier_label, identifier_value, number, composer_id, species_id, medium_id, publisher_id,
      call_number, condition_id, public_domain, additional_notes,
      own_physical, own_digital, missing_parts, scans_url, acquisition_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    title,
    finalIdentifierLabel,
    finalIdentifierValue,
    number,
    composer.id,
    genre.id,
    mediumId,
    publisher.id,
    callNumber.join(" "),
    condition,
    publicDomain,
    notes,
    ownPhysical,
    ownDigital,
    missingParts,
    scansUrl,
    acquisitionDate
  ];

  db.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error('Error executing INSERT query:', err);
      res.status(500).json({ error: 'Error adding new piece' });
      return;
    }

    const newPieceId = result.insertId;

    const selectQuery = `
      SELECT * FROM pieces WHERE id = ?
    `;

    db.query(selectQuery, [newPieceId], (err2, rows) => {
      if (err2) {
        console.error('Error retrieving new piece:', err2);
        res.status(500).json({ error: 'Piece added but retrieval failed' });
        return;
      }

      if (rows.length === 0) {
        res.status(404).json({ error: 'New piece not found after insert' });
        return;
      }

      res.status(201).json(rows[0]);
    });
  });
};


const editPiece = (req, res, db) => {
  const { id } = req.params;
  const {
    title,
    identifierLabel,
    identifierValue,
    number,
    composer,
    medium,
    genre,
    publisher,
    callNumber,
    condition,
    publicDomain,
    notes,
    ownPhysical,
    ownDigital,
    missingParts,
    scansUrl
  } = req.body.info;

  const finalIdentifierValue = identifierValue === "" ? null : identifierValue;
  const mediumId = medium.id || medium.options[0].id;

  const updateQuery = `
    UPDATE pieces
    SET title = ?, identifier_label = ?, identifier_value = ?, number = ?, composer_id = ?, species_id = ?, medium_id = ?,
        publisher_id = ?, call_number = ?, condition_id = ?, public_domain = ?, additional_notes = ?, own_physical = ?, own_digital = ?,
        missing_parts = ?, scans_url = ?
    WHERE id = ?
  `;

  const values = [
    title,
    identifierLabel,
    finalIdentifierValue,
    number,
    composer.id,
    genre.id,
    mediumId,
    publisher.id,
    callNumber.join(" "),
    condition,
    publicDomain,
    notes,
    ownPhysical,
    ownDigital,
    missingParts,
    scansUrl,
    id
  ];

  db.query(updateQuery, values, (err, result) => {
    if (err) {
      console.error('Error executing UPDATE query:', err);
      res.status(500).json({ error: 'Error updating piece' });
      return;
    }

    const selectQuery = `SELECT * FROM pieces WHERE id = ?`;

    db.query(selectQuery, [id], (err2, rows) => {
      if (err2) {
        console.error('Error retrieving updated piece:', err2);
        res.status(500).json({ error: 'Piece updated but retrieval failed' });
        return;
      }

      if (rows.length === 0) {
        res.status(404).json({ error: 'Updated piece not found' });
        return;
      }

      res.status(200).json(rows[0]);
    });
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