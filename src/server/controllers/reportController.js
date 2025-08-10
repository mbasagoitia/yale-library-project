const { 
  getAllPiecesQuery,
} = require("../helpers/pieceHelpers.js");

const getAllPieces = (req, res, next) => {
  const db = req.db;

  getAllPiecesQuery(db, (err, result) => {
    if (err) {
      const error = new Error('Error retrieving piece list');
      error.status = 500;
      return next(error);
    }
    res.status(200).json(result);
  });
};

const getMissing = (req, res, next) => {
  const db = req.db;

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
    ORDER BY c.last_name, c.first_name, p.title;`;

  db.query(query, (err, result) => {
    if (err) {
      const error = new Error('Error retrieving piece list');
      error.status = 500;
      return next(error);
    }
    res.status(200).json(result);
  });
};

const getPoorCondition = (req, res, next) => {
  const db = req.db;

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
    ORDER BY p.condition_id DESC, c.last_name ASC, p.title ASC;`;

  db.query(query, (err, result) => {
    if (err) {
      const error = new Error('Error retrieving piece list');
      error.status = 500;
      return next(error);
    }
    res.status(200).json(result);
  });
};

const getConditionSummary = (req, res, next) => {
  const db = req.db;

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
    ORDER BY con.id ASC;`;

  db.query(query, (err, result) => {
    if (err) {
      const error = new Error('Error retrieving condition summary');
      error.status = 500;
      return next(error);
    }
    res.status(200).json(result);
  });
};

const getMusicByComposer = (req, res, next) => {
  const db = req.db;

  const query = `
    SELECT 
    CONCAT(c.last_name, ', ', c.first_name) AS Composer,
    s.label AS Genre,
    p.title AS Title,
    COUNT(*) OVER (PARTITION BY c.id) AS TotalPiecesByComposer
  FROM pieces p
  JOIN composers c ON p.composer_id = c.id
  JOIN species_options s ON p.species_id = s.id
  ORDER BY COUNT(*) OVER (PARTITION BY c.id) DESC, c.last_name, c.first_name, s.label;`;

  db.query(query, (err, result) => {
    if (err) {
      const error = new Error('Error retrieving music by composer');
      error.status = 500;
      return next(error);
    }
    res.status(200).json(result);
  });
};

const getPerformanceHistory = (req, res, next) => {
  const db = req.db;
  const yearsAgo = parseInt(req.query.years, 10);

  if (isNaN(yearsAgo)) {
    const error = new Error('Invalid number of years provided');
    error.status = 400;
    return next(error);
  }

  const query = `
    SELECT 
      p.title AS Title,
      CONCAT(c.last_name, ', ', c.first_name) AS Composer,
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
      p.title ASC;`;

  db.query(query, [yearsAgo], (err, results) => {
    if (err) {
      const error = new Error('Error retrieving performance history');
      error.status = 500;
      return next(error);
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
};
