const getAllPiecesQuery = (db, callback) => {
    const query = `
      SELECT p.*, 
        c.last_name AS last_name, 
        c.first_name AS first_name, 
        s.label AS genre, 
        m.label AS medium, 
        COALESCE(mc.label, mo_parent.label) AS medium_category, 
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
      ORDER BY p.id
    `;
  
    db.query(query, callback);
  };

const getPieceById = (id, db, callback) => {
    const query = `
      SELECT 
        p.*, 
        c.last_name AS last_name, 
        c.first_name AS first_name, 
        s.label AS genre, 
        m.label AS medium, 
        COALESCE(mc.label, mo_parent.label) AS medium_category, 
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
      if (err) return callback(err);
      if (!results.length) return callback(new Error("Piece not found"));
      callback(null, results[0]);
    });
  };

const getFormattedDate = (datestring) => {
    const d = new Date(datestring);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
  
const insertNewPiece = (pieceInfo, db, callback) => {
    const {
        title, identifierLabel, identifierValue, number, composer, medium,
        genre, publisher, callNumber, condition, publicDomain, notes,
        ownPhysical, ownDigital, missingParts, scansUrl, acquisitionDate, lastPerformed
    } = pieceInfo;

    const finalIdentifierValue = identifierValue === "" ? null : identifierValue;
    const finalIdentifierLabel = !identifierValue ? null : identifierLabel;
    const mediumId = medium.id || medium.options?.[0]?.id || 1

    const acquisitionDateFormatted = acquisitionDate ? getFormattedDate(acquisitionDate) : null;
    const lastPerformedFormatted = lastPerformed ? getFormattedDate(lastPerformed) : null;

    const insertQuery = `
        INSERT INTO pieces (
        title, identifier_label, identifier_value, number, composer_id, species_id, medium_id, publisher_id,
        call_number, condition_id, public_domain, additional_notes,
        own_physical, own_digital, missing_parts, scans_url, acquisition_date, date_last_performed
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        title, finalIdentifierLabel, finalIdentifierValue, number,
        composer.id, genre.id, mediumId, publisher.id,
        callNumber.join(" "), condition, publicDomain, notes,
        ownPhysical, ownDigital, missingParts, scansUrl, acquisitionDateFormatted, lastPerformedFormatted
    ];

    db.query(insertQuery, values, callback);
};

  const updatePieceById = (id, pieceInfo, db, callback) => {
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
      scansUrl, 
      acquisitionDate,
      lastPerformed
    } = pieceInfo;
  
    const finalIdentifierValue = identifierValue === "" ? null : identifierValue;
    const mediumId = medium.id || medium.options?.[0]?.id;

    const acquisitionDateFormatted = acquisitionDate ? getFormattedDate(acquisitionDate) : null;
    const lastPerformedFormatted = lastPerformed ? getFormattedDate(lastPerformed) : null;
  
    const updateQuery = `
      UPDATE pieces
      SET title = ?, identifier_label = ?, identifier_value = ?, number = ?, composer_id = ?, species_id = ?, medium_id = ?,
          publisher_id = ?, call_number = ?, condition_id = ?, public_domain = ?, additional_notes = ?, own_physical = ?, own_digital = ?,
          missing_parts = ?, scans_url = ?, acquisition_date = ?, date_last_performed = ?
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
      acquisitionDateFormatted,
      lastPerformedFormatted,
      id
    ];
  
    db.query(updateQuery, values, callback);
  };

const deletePieceById = (id, db, callback) => {
    const query = 'DELETE FROM pieces WHERE id = ?';
    db.query(query, [id], callback);
};
  
  
module.exports = {
    getAllPiecesQuery,
    getPieceById,
    insertNewPiece,
    updatePieceById,
    deletePieceById
}