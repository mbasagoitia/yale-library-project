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

module.exports = {
    getComposerData,
};
