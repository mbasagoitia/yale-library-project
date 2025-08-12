const xss = require('xss');

const getMediumData = (req, res, next) => {
  const query = `
    SELECT mo.id, mc.label AS category_label, mo.label AS option_label, mo.value AS option_value,
      mo.parent_id AS parent_id, nested_mo.id AS nested_option_id, nested_mo.label AS nested_option_label, 
      nested_mo.value AS nested_option_value
    FROM medium_category mc 
    JOIN medium_options mo ON mc.id = mo.parent_id 
    LEFT JOIN medium_options nested_mo ON mo.value = nested_mo.parent_id AND mo.parent_id = "6"
    ORDER BY mo.value, nested_mo.value;
  `;
  req.db.query(query, (err, rows) => {
    if (err) {
      const error = new Error('Error retrieving medium list');
      error.status = 500;
      return next(error);
    }
    res.status(200).json(rows);
  });
};

const getComposerData = (req, res, next) => {
  const query = 'SELECT * FROM composers';
  req.db.query(query, (err, rows) => {
    if (err) {
      const error = new Error('Error retrieving composer list');
      error.status = 500;
      return next(error);
    }
    res.status(200).json(rows);
  });
};

const addComposer = (req, res, next) => {
  const { lastName, firstName, cutterNumber } = req.body;

  lastName = xss(lastName);
  firstName = xss(firstName);
  cutterNumber = xss(cutterNumber);

  const query = 'INSERT INTO composers (last_name, first_name, cutter_number) VALUES (?, ?, ?)';
  const values = [lastName, firstName, cutterNumber];

  req.db.query(query, values, (err, rows) => {
    if (err) {
      const error = new Error('Error inserting new composer');
      error.status = 500;
      return next(error);
    }
    res.status(200).json(rows);
  });
};

const getSpeciesData = (req, res, next) => {
  const query = 'SELECT * FROM species_category sc JOIN species_options so ON sc.id = so.species_category_id;';
  req.db.query(query, (err, rows) => {
    if (err) {
      const error = new Error('Error retrieving species list');
      error.status = 500;
      return next(error);
    }
    res.status(200).json(rows);
  });
};

const getPublisherData = (req, res, next) => {
  const query = 'SELECT * FROM publisher_category pc JOIN publisher_options po ON pc.id = po.publisher_category_id;';
  req.db.query(query, (err, rows) => {
    if (err) {
      const error = new Error('Error retrieving publisher list');
      error.status = 500;
      return next(error); 
    }
    res.status(200).json(rows);
  });
};

module.exports = {
  getMediumData,
  getComposerData,
  addComposer,
  getSpeciesData,
  getPublisherData
};
