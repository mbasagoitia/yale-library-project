const getAllPieces = (req, res, db) => {
  const query = `
    SELECT 
      CONCAT(c.last_name, ', ', c.first_name) AS Composer,
      p.title AS Title,
      pub.label AS Publisher,
      p.additional_notes AS Notes,
      con.label AS 'Condition',
      p.call_number AS 'Call Number',
      DATE_FORMAT(p.acquisition_date, '%b %e, %Y') AS 'Acquisition Date'
    FROM pieces p
    INNER JOIN composers c ON p.composer_id = c.id 
    INNER JOIN publisher_options pub ON p.publisher_id = pub.id
    INNER JOIN conditions con ON p.condition_id = con.id
    ORDER BY Composer ASC, Title ASC;
  `;
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      return res.status(500).json({ error: 'Error retrieving piece list' });
    }
    res.status(200).json(result);
  });
};

// For some reason this isn't returning anything

const getMissingAndCondition = (req, res, db) => {
  const query = `
    SELECT 
      p.title AS Title,
      CONCAT(c.last_name, ', ', c.first_name) AS Composer,
      pub.label AS Publisher,
      p.additional_notes AS Notes,
      con.label AS 'Condition',
      p.call_number AS 'Call Number',
      p.acquisition_date AS 'Acquisition Date'
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
      return res.status(500).json({ error: 'Error retrieving piece list' });
    }
    res.status(200).json(result);
  });
};

// Express as a percentage?

const getConditionSummary = (req, res, db) => {
  const query = `
    SELECT 
      con.label AS 'Condition',
      COUNT(p.id) AS 'Number of Pieces'
    FROM conditions con
    LEFT JOIN pieces p ON p.condition_id = con.id
    GROUP BY con.id, con.label
    ORDER BY con.id ASC;
  `;
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      return res.status(500).json({ error: 'Error retrieving condition summary' });
    }
    res.status(200).json(result);
  });
};


const getMusicByComposer = (req, res, db) => {
  const query = `
    SELECT 
      CONCAT(c.last_name, ', ', c.first_name) AS Composer,
      s.label AS Genre,
      p.title AS Title,
      COUNT(*) OVER (PARTITION BY c.id) AS 'Total Pieces by Composer',
      COUNT(*) OVER (PARTITION BY c.id, s.label) AS 'Pieces in Genre by Composer'
    FROM pieces p
    JOIN composers c ON p.composer_id = c.id
    JOIN species_options s ON p.species_id = s.id
    ORDER BY c.last_name, c.first_name, s.label, p.title;
  `;
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      return res.status(500).json({ error: 'Error retrieving music by composer' });
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
      p.title AS Title,
      CONCAT(c.last_name, ', ', c.first_name) AS Composer,
      p.last_performed AS 'Last Performed'
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
      return res.status(500).json({ error: 'Error retrieving performance history' });
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