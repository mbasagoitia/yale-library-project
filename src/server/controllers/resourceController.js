const getMediumData = (req, res, db) => {
    const query = 'SELECT mo.id, mc.label AS category_label, mo.label AS option_label, mo.value AS option_value, mo.parent_id AS parent_id, nested_mo.id AS nested_option_id, nested_mo.label AS nested_option_label, nested_mo.value AS nested_option_value FROM  medium_category mc JOIN  medium_options mo ON mc.id = mo.parent_id LEFT JOIN medium_options nested_mo ON mo.value = nested_mo.parent_id AND mo.parent_id = "6" ORDER BY mo.value, nested_mo.value;';
    db.query(query, (err, rows) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          res.status(500).json({ error: 'Error retrieving medium list' });
          return;
        }
        res.status(200).json(rows);
      });
};

const getSingleMediumData = (req, res, db) => {
    const id = req.params;
    const query = 'SELECT mo.id, mc.label AS category_label, mo.label AS option_label, mo.value AS option_value, mo.parent_id AS parent_id, nested_mo.id AS nested_option_id, nested_mo.label AS nested_option_label, nested_mo.value AS nested_option_value FROM  medium_category mc JOIN  medium_options mo ON mc.id = mo.parent_id LEFT JOIN medium_options nested_mo ON mo.value = nested_mo.parent_id AND mo.parent_id = "6" ORDER BY mo.value, nested_mo.value WHERE mo.id = ?';
    db.query(query, [id], (err, rows) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          res.status(500).json({ error: 'Error retrieving medium' });
          return;
        }
        res.status(200).json(rows);
      });
};

const getComposerData = (req, res, db) => {
  const query = 'SELECT * FROM composers';
  db.query(query, (err, rows) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Error retrieving composer list' });
        return;
      }
      res.status(200).json(rows);
    });
};

const getSingleComposerData = (req, res, db) => {
  const id = req.params;
  const query = 'SELECT * FROM composers WHERE id = ?';
  db.query(query, [id], (err, rows) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Error retrieving composer' });
        return;
      }
      res.status(200).json(rows);
    });
};

const addComposer = (req, res, db) => {
  const { lastName, firstName, cutterNumber } = req.body;

  const query = 'INSERT INTO composers (last_name, first_name, cutter_number) VALUES (?, ?, ?)';
  const values = [lastName, firstName, cutterNumber];

  db.query(query, values, (err, rows) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Error inserting new composer' });
      return;
    }
    res.status(200).json(rows);
  })
}

const getSpeciesData = (req, res, db) => {
  const query = 'SELECT * FROM species_category sc JOIN species_options so ON sc.id = so.species_category_id;';
  db.query(query, (err, rows) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Error retrieving species list' });
        return;
      }
      res.status(200).json(rows);
    });
};

const getSingleSpeciesData = (req, res, db) => {
  const id = req.params;
  const query = 'SELECT * FROM species_category sc JOIN species_options so ON sc.id = so.species_category_id WHERE so.id = ?';
  db.query(query, [id], (err, rows) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Error retrieving species' });
        return;
      }
      res.status(200).json(rows);
    });
};

const getPublisherData = (req, res, db) => {
    const query = 'SELECT * FROM publisher_category pc JOIN publisher_options po ON pc.id = po.publisher_category_id;';
    db.query(query, (err, rows) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          res.status(500).json({ error: 'Error retrieving publisher list' });
          return;
        }
        res.status(200).json(rows);
      });
};

const getSinglePublisherData = (req, res, db) => {
  const id = req.params;
    const query = 'SELECT * FROM publisher_category pc JOIN publisher_options po ON pc.id = po.publisher_category_id WHERE po.id = ?';
    db.query(query, [id], (err, rows) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          res.status(500).json({ error: 'Error retrieving publisher' });
          return;
        }
        res.status(200).json(rows);
      });
};

module.exports = {
    getMediumData,
    getSingleMediumData,
    getComposerData,
    getSingleComposerData,
    addComposer,
    getSpeciesData,
    getSingleSpeciesData,
    getPublisherData,
    getSinglePublisherData
};
