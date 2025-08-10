const xssClean = require('xss-clean');

const addNewAdmin = (req, res, db, next) => {
  let { netid, name } = req.body;

  netid = xssClean(netid);
  name = xssClean(name);

  const query = `INSERT INTO admins (netid, name) VALUES (?, ?)`;

  db.query(query, [netid, name], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);

      const error = new Error('Error adding new admin. Please try again.');
      error.status = 500;
      return next(error);
    }

    res.status(200).json({ message: `Successfully added ${name} with NetID of ${netid} as a system administrator.` });
  });
};


export {
    addNewAdmin
}