const getAllPieces = (req, res, db) => {
  const query = `
    SELECT 
      CONCAT(c.last_name, ', ', c.first_name) AS Composer,
      p.title AS Title,
      pub.label AS Publisher,
      p.additional_notes AS Notes,
      con.label AS 'Condition',
      p.call_number AS 'Call Number',
      DATE_FORMAT(p.acquisition_date, '%b %e, %Y') AS 'Acquisition Date',
      DATE_FORMAT(p.date_last_performed, '%b %e, %Y') AS 'Date Last Performed'
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

const getMissing = (req, res, db) => {
  const query = `
  SELECT 
    p.title AS Title,
    CONCAT(c.last_name, ', ', c.first_name) AS Composer,
    pub.label AS Publisher,
    p.additional_notes AS Notes,
    con.label AS 'Condition',
    p.call_number AS 'Call Number',
    DATE_FORMAT(p.acquisition_date, '%b %e, %Y') AS 'Acquisition Date',
    DATE_FORMAT(p.date_last_performed, '%b %e, %Y') AS 'Date Last Performed'
  FROM pieces p
  INNER JOIN composers c ON p.composer_id = c.id 
  INNER JOIN publisher_options pub ON p.publisher_id = pub.id
  INNER JOIN conditions con ON p.condition_id = con.id
  WHERE p.missing_parts = 1
  ORDER BY c.last_name, c.first_name, p.title;`
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      return res.status(500).json({ error: 'Error retrieving piece list' });
    }
    res.status(200).json(result);
  });
};

const getPoorCondition = (req, res, db) => {
  const query = `
  SELECT 
    p.title AS Title,
    CONCAT(c.last_name, ', ', c.first_name) AS Composer,
    pub.label AS Publisher,
    p.additional_notes AS Notes,
    con.label AS 'Condition',
    p.call_number AS 'Call Number',
    DATE_FORMAT(p.acquisition_date, '%b %e, %Y') AS 'Acquisition Date',
    DATE_FORMAT(p.date_last_performed, '%b %e, %Y') AS 'Date Last Performed'
  FROM pieces p
  INNER JOIN composers c ON p.composer_id = c.id 
  INNER JOIN publisher_options pub ON p.publisher_id = pub.id
  INNER JOIN conditions con ON p.condition_id = con.id
  WHERE p.condition_id > 2
  ORDER BY p.condition_id DESC, c.last_name ASC, p.title ASC;`
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      return res.status(500).json({ error: 'Error retrieving piece list' });
    }
    console.log(result);
    res.status(200).json(result);
  });
};

const getConditionSummary = (req, res, db) => {
  const query = `
    SELECT 
      con.label AS 'Condition',
      COUNT(p.id) AS 'Number of Pieces',
      CONCAT(ROUND((COUNT(p.id) / total.total_count) * 100), '%') AS 'Percentage'
    FROM conditions con
    LEFT JOIN pieces p ON p.condition_id = con.id
    JOIN (
      SELECT COUNT(*) AS total_count FROM pieces
    ) AS total
    GROUP BY con.id, con.label, total.total_count
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
    COUNT(*) OVER (PARTITION BY c.id) AS TotalPiecesByComposer
  FROM pieces p
  JOIN composers c ON p.composer_id = c.id
  JOIN species_options s ON p.species_id = s.id
  ORDER BY COUNT(*) OVER (PARTITION BY c.id) DESC, c.last_name, c.first_name, s.label;
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
      DATE_FORMAT(p.acquisition_date, '%b %e, %Y') AS 'Acquisition Date',
      DATE_FORMAT(p.date_last_performed, '%b %e, %Y') AS 'Date Last Performed'
    FROM pieces p
    JOIN composers c ON p.composer_id = c.id
    WHERE 
      p.date_last_performed IS NOT NULL
      AND YEAR(p.date_last_performed) BETWEEN YEAR(CURDATE()) - ? AND YEAR(CURDATE())
    ORDER BY 
      p.date_last_performed DESC,
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
    getMissing,
    getPoorCondition,
    getConditionSummary,
    getMusicByComposer,
    getPerformanceHistory
}