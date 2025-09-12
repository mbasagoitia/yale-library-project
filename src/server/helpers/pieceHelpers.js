const xss = require('xss');

// Utilities

const to01 = (v) => (v ? 1 : 0);
function fmtDate(d) {
  // <--- START HERE (may need to delete haydn cello concerto from database directly)
  // why doesn't scans redirect work
  console.log("formatting date", d);
  if (!d) return null;
  if (typeof d === 'string') return d.slice(0, 10);
  const dt = new Date(d);
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${dt.getFullYear()}-${mm}-${dd}`;
}

function mediumCategoryExpr(db) {
  return db.raw(`
    CASE
      WHEN m.category_id BETWEEN 0 AND 9 THEN mc.label
      WHEN parent.category_id BETWEEN 0 AND 9 THEN mc_parent.label
      WHEN grand.category_id BETWEEN 0 AND 9 THEN mc_grand.label
      ELSE mc.label
    END AS medium_category
  `);
}

function baseSelect(db) {
  return db('pieces as p')
    .join('composers as c', 'p.composer_id', 'c.id')
    .join('species_options as s', 'p.species_id', 's.id')
    .join('medium_options as m', 'p.medium_id', 'm.id')
    .leftJoin({ parent: 'medium_options' }, 'm.parent_id', 'parent.id')
    .leftJoin({ grand: 'medium_options' }, 'parent.parent_id', 'grand.id')
    .leftJoin({ mc: 'medium_category' }, 'm.category_id', 'mc.id')
    .leftJoin({ mc_parent: 'medium_category' }, 'parent.category_id', 'mc_parent.id')
    .leftJoin({ mc_grand: 'medium_category' }, 'grand.category_id', 'mc_grand.id')
    .join('publisher_options as pub', 'p.publisher_id', 'pub.id')
    .join('conditions as con', 'p.condition_id', 'con.id')
    .select(
      'p.*',
      { last_name: 'c.last_name' },
      { first_name: 'c.first_name' },
      { genre: 's.label' },
      { medium: 'm.label' },
      mediumCategoryExpr(db),
      { publisher: 'pub.label' },
      { condition: 'con.label' }
    )
    .orderBy('p.id', 'asc');
}

// Queries

async function getAllPiecesQuery(db) {
  return baseSelect(db).orderBy('p.id', 'asc');
}

async function getPieceById(id, db) {
  return baseSelect(db).where('p.id', id).first();
}

function normalizePieceInfo(info = {}) {

  let {
    title,
    identifierLabel,
    identifierValue,
    number,
    composer,
    medium,
    genre,
    publisher,
    callNumber,
    condition,
    publicDomain,
    notes,
    ownPhysical,
    ownDigital,
    missingParts,
    scansUrl,
    acquisitionDate,
    lastPerformed,
  } = info;

  title = title ? xss(String(title).trim()) : null;
  identifierLabel = identifierLabel ? xss(String(identifierLabel)) : null;

  const finalIdentifierValue =
    identifierValue === '' || identifierValue == null ? null : Number(identifierValue);
  const finalIdentifierLabel = finalIdentifierValue == null ? null : identifierLabel;

  const numberVal = number == null || number === '' ? null : String(number).trim();

  const composerId = composer?.id != null ? Number(composer.id) : null;
  const genreId = genre?.id != null ? Number(genre.id) : null;
  const mediumId =
    medium?.id != null
      ? Number(medium.id)
      : medium?.options?.[0]?.id != null
      ? Number(medium.options[0].id)
      : null;

  const publisherId = publisher?.id != null ? Number(publisher.id) : null;

  const callNumStr = Array.isArray(callNumber) ? callNumber.map((v) => xss(String(v))).join(' ') : null;

  const conditionId = condition != null ? Number(condition) : null;

  const notesSan = notes ? xss(String(notes)) : null;
  const scansUrlSan = scansUrl ? xss(String(scansUrl)) : null;

  return {
    title,
    identifier_label: finalIdentifierLabel,
    identifier_value: finalIdentifierValue,
    number: numberVal,
    composer_id: composerId,
    species_id: genreId,
    medium_id: mediumId,
    publisher_id: publisherId,
    call_number: callNumStr,
    condition_id: conditionId,
    public_domain: to01(publicDomain),
    additional_notes: notesSan,
    own_physical: to01(ownPhysical),
    own_digital: to01(ownDigital),
    missing_parts: to01(missingParts),
    scans_url: scansUrlSan,
    acquisition_date: fmtDate(acquisitionDate),
    date_last_performed: fmtDate(lastPerformed),
  };
}

async function insertNewPiece(pieceInfo, db) {
  const row = normalizePieceInfo(pieceInfo);

  for (const [tbl, key] of [
    ['composers', 'composer_id'],
    ['species_options', 'species_id'],
    ['medium_options', 'medium_id'],
    ['publisher_options', 'publisher_id'],
    ['conditions', 'condition_id'],
  ]) {
    if (!row[key]) {
      const e = new Error(`${key} is required`);
      e.status = 400;
      throw e;
    }
    const ok = await db(tbl).where({ id: row[key] }).first('id');
    if (!ok) {
      const e = new Error(`Invalid ${key}`);
      e.status = 400;
      throw e;
    }
  }

  const [id] = await db('pieces').insert(row);
  return Array.isArray(id) ? id[0] : id;
}

async function updatePieceById(id, pieceInfo, db) {
  const idNum = Number(id);
  if (!Number.isInteger(idNum)) {
    const e = new Error('Invalid ID format');
    e.status = 400;
    throw e;
  }

  const exists = await db('pieces').where({ id: idNum }).first('id');
  if (!exists) return 0;

  const row = normalizePieceInfo(pieceInfo);
  const affected = await db('pieces').where({ id: idNum }).update(row);
  return affected;
}

async function deletePieceById(id, db) {
  const idNum = Number(id);
  if (!Number.isInteger(idNum)) {
    const e = new Error('Invalid ID format');
    e.status = 400;
    throw e;
  }
  const affected = await db('pieces').where({ id: idNum }).del();
  return affected;
}

module.exports = {
  getAllPiecesQuery,
  getPieceById,
  insertNewPiece,
  updatePieceById,
  deletePieceById
};
