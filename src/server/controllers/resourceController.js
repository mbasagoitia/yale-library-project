const xss = require('xss');

async function getMediumData(req, res, next) {
  try {
    const db = req.db;

    const rows = await db('medium_category as mc')
      .join('medium_options as mo', 'mc.id', 'mo.parent_id')
      .leftJoin({ nested_mo: 'medium_options' }, function () {
        this.on('mo.value', '=', 'nested_mo.parent_id')
            .andOn(db.raw('mo.parent_id = ?', ['6']));
      })
      .select(
        'mo.id',
        db.ref('mc.label').as('category_label'),
        db.ref('mo.label').as('option_label'),
        db.ref('mo.value').as('option_value'),
        db.ref('mo.parent_id').as('parent_id'),
        db.ref('nested_mo.id').as('nested_option_id'),
        db.ref('nested_mo.label').as('nested_option_label'),
        db.ref('nested_mo.value').as('nested_option_value')
      )
      .orderBy('mo.value', 'asc')
      .orderBy('nested_mo.value', 'asc');

    res.status(200).json(rows);
  } catch (err) {
    err.status = 500;
    err.message = 'Error retrieving medium list';
    next(err);
  }
}


async function getComposerData(req, res, next) {
  try {
    const rows = await req.db('composers')
      .select('id', 'last_name', 'first_name', 'cutter_number')
      .orderBy([{ column: 'last_name', order: 'asc' }, { column: 'first_name', order: 'asc' }]);

    res.status(200).json(rows);
  } catch (err) {
    err.status = 500;
    err.message = 'Error retrieving composer list';
    next(err);
  }
}

async function addComposer(req, res, next) {
  try {
    let { lastName, firstName, cutterNumber } = req.body || {};
    lastName     = xss(String(lastName || '').trim());
    firstName    = xss(String(firstName || '').trim());
    cutterNumber = xss(String(cutterNumber || '').trim());

    if (!lastName || !firstName || !cutterNumber) {
      return res.status(400).json({ error: 'lastName, firstName, and cutterNumber are required' });
    }

    const [id] = await req.db('composers').insert({
      last_name: lastName,
      first_name: firstName,
      cutter_number: cutterNumber,
    });

    const created = await req.db('composers').where({ id }).first();
    res.status(201).json(created);
  } catch (err) {
    err.status = 500;
    err.message = 'Error inserting new composer';
    next(err);
  }
}

async function getSpeciesData(req, res, next) {
  try {
    const rows = await req.db('species_category as sc')
      .join('species_options as so', 'sc.id', 'so.species_category_id')
      .select(
        'sc.id as category_id',
        'sc.label as category_label',
        'so.id as option_id',
        'so.abbr as option_abbr',
        'so.label as option_label'
      )
      .orderBy([
        { column: 'sc.id', order: 'asc' },
        { column: 'so.label', order: 'asc' },
      ]);

    res.status(200).json(rows);
  } catch (err) {
    err.status = 500;
    err.message = 'Error retrieving species list';
    next(err);
  }
}

async function getPublisherData(req, res, next) {
  try {
    const rows = await req.db('publisher_category as pc')
      .join('publisher_options as po', 'pc.id', 'po.publisher_category_id')
      .select(
        'pc.id as category_id',
        'pc.label as category_label',
        'po.id as option_id',
        'po.abbr as option_abbr',
        'po.label as option_label'
      )
      .orderBy([
        { column: 'pc.id', order: 'asc' },
        { column: 'po.label', order: 'asc' },
      ]);

    res.status(200).json(rows);
  } catch (err) {
    err.status = 500;
    err.message = 'Error retrieving publisher list';
    next(err);
  }
}

module.exports = {
  getMediumData,
  getComposerData,
  addComposer,
  getSpeciesData,
  getPublisherData,
};
