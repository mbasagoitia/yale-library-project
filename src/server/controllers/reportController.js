const { getAllPiecesQuery } = require('../helpers/pieceHelpers');

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function prettyDate(d) {
  if (!d) return null;
  const dt = new Date(d);
  if (isNaN(dt)) return null;
  return `${MONTHS[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`;
}
function yyyyMmDd(dateLike) {
  const d = new Date(dateLike);
  if (isNaN(d)) return null;
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

async function getAllPieces(req, res, next) {
  try {
    const rows = await getAllPiecesQuery(req.db);
    res.status(200).json(rows);
  } catch (err) {
    err.status = 500;
    err.message = 'Error retrieving piece list';
    next(err);
  }
}

async function getMissing(req, res, next) {
  try {
    const db = req.db;
    const rows = await db('pieces as p')
      .innerJoin('composers as c', 'p.composer_id', 'c.id')
      .innerJoin('publisher_options as pub', 'p.publisher_id', 'pub.id')
      .innerJoin('conditions as con', 'p.condition_id', 'con.id')
      .where('p.missing_parts', 1)
      .select(
        db.ref('p.title').as('Title'),
        db.raw("c.last_name || ', ' || c.first_name as Composer"),
        db.ref('pub.label').as('Publisher'),
        db.ref('p.additional_notes').as('Notes'),
        db.ref('con.label').as('Condition'),
        db.ref('p.call_number').as('Call Number'),
        db.ref('p.acquisition_date').as('acquisition_date'),
        db.ref('p.date_last_performed').as('date_last_performed'),
      )
      .orderBy([{ column: 'c.last_name', order: 'asc' }, { column: 'c.first_name', order: 'asc' }, { column: 'p.title', order: 'asc' }]);

    const fixed = rows.map(r => ({
      Title: r.Title,
      Composer: `${r.Composer || ''}`.includes(', ') ? r.Composer : `${r.c_last_name ? r.c_last_name + ', ' : ''}${r.c_first_name || ''}`, // fallback
      Publisher: r.Publisher,
      Notes: r.Notes,
      Condition: r.Condition,
      'Call Number': r['Call Number'],
      'Acquisition Date': prettyDate(r.acquisition_date),
      'Date Last Performed': prettyDate(r.date_last_performed),
    }));

    if (fixed.some(x => x.Composer === 'null, null' || x.Composer === 'undefined, undefined')) {
      const rows2 = await req.db('pieces as p')
        .innerJoin('composers as c', 'p.composer_id', 'c.id')
        .innerJoin('publisher_options as pub', 'p.publisher_id', 'pub.id')
        .innerJoin('conditions as con', 'p.condition_id', 'con.id')
        .where('p.missing_parts', 1)
        .select(
          'p.title as Title',
          'c.last_name as last_name',
          'c.first_name as first_name',
          'pub.label as Publisher',
          'p.additional_notes as Notes',
          'con.label as Condition',
          'p.call_number as Call Number',
          'p.acquisition_date as acquisition_date',
          'p.date_last_performed as date_last_performed',
        )
        .orderBy([{ column: 'c.last_name', order: 'asc' }, { column: 'c.first_name', order: 'asc' }, { column: 'p.title', order: 'asc' }]);
      return res.json(rows2.map(r => ({
        Title: r.Title,
        Composer: `${r.last_name}, ${r.first_name}`,
        Publisher: r.Publisher,
        Notes: r.Notes,
        Condition: r.Condition,
        'Call Number': r['Call Number'],
        'Acquisition Date': prettyDate(r.acquisition_date),
        'Date Last Performed': prettyDate(r.date_last_performed),
      })));
    }

    res.json(fixed);
  } catch (err) {
    err.status = 500;
    err.message = 'Error retrieving piece list';
    next(err);
  }
}

async function getPoorCondition(req, res, next) {
  try {
    const db = req.db;
    const rows = await db('pieces as p')
      .innerJoin('composers as c', 'p.composer_id', 'c.id')
      .innerJoin('publisher_options as pub', 'p.publisher_id', 'pub.id')
      .innerJoin('conditions as con', 'p.condition_id', 'con.id')
      .where('p.condition_id', '>', 2)
      .select(
        'p.title as Title',
        'c.last_name as last_name',
        'c.first_name as first_name',
        'pub.label as Publisher',
        'p.additional_notes as Notes',
        'con.label as Condition',
        'p.call_number as Call Number',
        'p.acquisition_date as acquisition_date',
        'p.date_last_performed as date_last_performed',
        'p.condition_id as _cond_order'
      )
      .orderBy([{ column: '_cond_order', order: 'desc' }, { column: 'c.last_name', order: 'asc' }, { column: 'p.title', order: 'asc' }]);

    const out = rows.map(r => ({
      Title: r.Title,
      Composer: `${r.last_name}, ${r.first_name}`,
      Publisher: r.Publisher,
      Notes: r.Notes,
      Condition: r.Condition,
      'Call Number': r['Call Number'],
      'Acquisition Date': prettyDate(r.acquisition_date),
      'Date Last Performed': prettyDate(r.date_last_performed),
    }));
    res.json(out);
  } catch (err) {
    err.status = 500;
    err.message = 'Error retrieving piece list';
    next(err);
  }
}

async function getConditionSummary(req, res, next) {
  try {
    const db = req.db;

    const [{ count: totalRaw }] = await db('pieces').count({ count: '*' });
    const total = Number(totalRaw) || 0;

    const rows = await db('conditions as con')
      .leftJoin('pieces as p', 'p.condition_id', 'con.id')
      .groupBy('con.id', 'con.label')
      .orderBy('con.id', 'asc')
      .select('con.label as Condition')
      .count({ NumberOfPieces: 'p.id' });

    const out = rows.map(r => {
      const n = Number(r.NumberOfPieces) || 0;
      const pct = total ? Math.round((n / total) * 100) : 0;
      return {
        Condition: r.Condition,
        'Number of Pieces': n,
        Percentage: `${pct}%`,
      };
    });

    res.json(out);
  } catch (err) {
    err.status = 500;
    err.message = 'Error retrieving condition summary';
    next(err);
  }
}

async function getMusicByComposer(req, res, next) {
  try {
    const db = req.db;

    const rows = await db('pieces as p')
      .join('composers as c', 'p.composer_id', 'c.id')
      .join('species_options as s', 'p.species_id', 's.id')
      .select(
        'c.id as composer_id',
        'c.last_name',
        'c.first_name',
        's.label as Genre',
        'p.title as Title'
      );

    const totals = await db('pieces').select('composer_id').count({ cnt: '*' }).groupBy('composer_id');
    const totalMap = new Map(totals.map(t => [t.composer_id, Number(t.cnt)]));

    const enriched = rows.map(r => ({
      Composer: `${r.last_name}, ${r.first_name}`,
      Genre: r.Genre,
      Title: r.Title,
      TotalPiecesByComposer: totalMap.get(r.composer_id) || 0,
      _sort_last: r.last_name,
      _sort_first: r.first_name,
    }));

    enriched.sort((a,b) =>
      b.TotalPiecesByComposer - a.TotalPiecesByComposer ||
      a._sort_last.localeCompare(b._sort_last) ||
      a._sort_first.localeCompare(b._sort_first) ||
      a.Genre.localeCompare(b.Genre)
    );

    const out = enriched.map(({ _sort_last, _sort_first, ...rest }) => rest);
    res.json(out);
  } catch (err) {
    err.status = 500;
    err.message = 'Error retrieving music by composer';
    next(err);
  }
}

async function getPerformanceHistory(req, res, next) {
  try {
    const db = req.db;
    const yearsAgo = parseInt(req.query.years, 10);
    if (isNaN(yearsAgo) || yearsAgo < 0) {
      return res.status(400).json({ error: 'Invalid number of years provided' });
    }

    const now = new Date();
    const start = new Date(now);
    start.setFullYear(now.getFullYear() - yearsAgo);

    const threshold = yyyyMmDd(start);

    const rows = await db('pieces as p')
      .join('composers as c', 'p.composer_id', 'c.id')
      .whereNotNull('p.date_last_performed')
      .andWhere('p.date_last_performed', '>=', threshold)
      .select(
        'p.title as Title',
        'c.last_name as last_name',
        'c.first_name as first_name',
        'p.acquisition_date as acquisition_date',
        'p.date_last_performed as date_last_performed'
      )
      .orderBy([
        { column: 'p.date_last_performed', order: 'desc' },
        { column: 'c.last_name', order: 'asc' },
        { column: 'c.first_name', order: 'asc' },
        { column: 'p.title', order: 'asc' },
      ]);

    const out = rows.map(r => ({
      Title: r.Title,
      Composer: `${r.last_name}, ${r.first_name}`,
      'Acquisition Date': prettyDate(r.acquisition_date),
      'Date Last Performed': prettyDate(r.date_last_performed),
    }));

    res.json(out);
  } catch (err) {
    err.status = 500;
    err.message = 'Error retrieving performance history';
    next(err);
  }
}

module.exports = {
  getAllPieces,
  getMissing,
  getPoorCondition,
  getConditionSummary,
  getMusicByComposer,
  getPerformanceHistory,
};
