const getAllPieces = (req, res, db) => {
    const query = 'SELECT p.*, c.last_name AS last_name, c.first_name AS first_name, s.label AS genre, m.label AS medium, COALESCE(mc.label, mo_parent.label) AS medium_category, pub.label AS publisher, con.label AS "condition" FROM pieces p JOIN composers c ON p.composer_id = c.id JOIN species_options s ON p.species_id = s.id JOIN medium_options m ON p.medium_id = m.id LEFT JOIN medium_category mc ON m.category_id = mc.id LEFT JOIN medium_options mo_parent ON m.category_id = 66 AND m.category_id = mo_parent.value JOIN publisher_options pub ON p.publisher_id = pub.id JOIN conditions con ON p.condition_id = con.id ORDER BY p.id';
    db.query(query, (err, result) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          res.status(500).json({ error: 'Error retrieving piece list' });
          return;
        }
        res.status(200).json(result);
      });
};

const getMissingAndCondition = (req, res, db) => {
    const query = `SELECT 
        p.title AS Title,
        c.last_name AS composer_lastname,
        c.first_name AS composer_firstname,
        pub.label AS publisher,
        p.additional_notes AS additional_notes,
        con.label AS condition_description,
        p.call_number,
        p.acquisition_date
        FROM pieces p
        INNER JOIN composers c ON p.composer_id = c.id 
        INNER JOIN publisher_options pub ON p.publisher_id = pub.id
        INNER JOIN conditions con ON p.condition_id = con.id
        WHERE condition_id > 2 AND missing_parts = 1
        ORDER BY condition_id DESC, c.last_name ASC, p.title ASC;
        `;
    db.query(query, (err, result) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          res.status(500).json({ error: 'Error retrieving piece list' });
          return;
        }
        res.status(200).json(result);
      });
};

const getConditionSummary = (req, res, db) => {
    const query = `SELECT 
        con.id AS condition_id,
        con.label AS condition_description,
        COUNT(p.id) AS number_of_pieces
        FROM conditions con
        LEFT JOIN pieces p ON p.condition_id = con.id
        GROUP BY con.id, con.label
        ORDER BY con.id ASC;
        `;
    db.query(query, (err, result) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          res.status(500).json({ error: 'Error retrieving piece list' });
          return;
        }
        res.status(200).json(result);
      });
};

const getMusicByComposer = (req, res, db) => {
    const query = `SELECT 
        c.last_name,
        c.first_name,
        s.label AS genre,
        p.title,
        COUNT(*) OVER (PARTITION BY c.id) AS total_pieces_by_composer,
        COUNT(*) OVER (PARTITION BY c.id, s.label) AS pieces_in_genre_by_composer
        FROM pieces p
        JOIN composers c ON p.composer_id = c.id
        JOIN species_options s ON p.species_id = s.id
        ORDER BY c.last_name, c.first_name, s.label, p.title;
        `;
    db.query(query, (err, result) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          res.status(500).json({ error: 'Error retrieving piece list' });
          return;
        }
        res.status(200).json(result);
      });
};

const getPerformanceHistory = (req, res, db) => {
    const yearsAgo = parseInt(req.query.years, 10);
  
    if (isNaN(yearsAgo)) {
      return res.status(400).json({ error: 'Invalid number of years provided' });
    }
  
    const query = `
      SELECT 
        p.title,
        c.last_name,
        c.first_name,
        p.last_performed
      FROM pieces p
      JOIN composers c ON p.composer_id = c.id
      WHERE 
        p.last_performed IS NOT NULL
        AND YEAR(p.last_performed) BETWEEN YEAR(CURDATE()) - ? AND YEAR(CURDATE())
      ORDER BY 
        p.last_performed DESC,
        c.last_name ASC,
        c.first_name ASC,
        p.title ASC;
    `;
  
    db.query(query, [yearsAgo], (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return res.status(500).json({ error: 'Error retrieving piece list' });
      }
      res.status(200).json(results);
    });
  };

module.exports = {
    getAllPieces,
    getMissingAndCondition,
    getConditionSummary,
    getMusicByComposer,
    getPerformanceHistory
}