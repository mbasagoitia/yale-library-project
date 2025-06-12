const addNewAdmin = (req, res, db) => {
    const { netid, name } = req.body.info;

    // Might want to add in sanization, maybe middlewhere somewhere else?

    const query = `INSERT INTO admins (netid, name) VALUES (?, ?)`;

    db.query(query, [netid, name], (err, result) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          res.status(500).json({ error: 'Error adding new admin' });
          return;
        }
        res.status(200).json(result);
      });
};

export {
    addNewAdmin
}