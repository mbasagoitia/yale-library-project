const xss = require('xss');

async function addNewAdmin(req, res, next) {
  const db = req.db;

  let { netid, name } = req.body;
  netid = xss((netid || '').trim());
  name  = xss((name  || '').trim());

  if (!netid || !name) {
    return res.status(400).json({ error: 'netid and name are required' });
  }

  try {
    const existing = await db('admins').where({ netid }).first();
    if (existing) {
      return res.status(409).json({ error: `Admin with netid "${netid}" already exists.` });
    }

    const [id] = await db('admins').insert({ netid, name });
    return res.status(201).json({ message: `Added ${name} (${netid}).`, id });
  } catch (err) {
    err.status = 500;
    err.message = 'Error adding new admin. Please try again.';
    return next(err);
  }
}

module.exports = { addNewAdmin };
