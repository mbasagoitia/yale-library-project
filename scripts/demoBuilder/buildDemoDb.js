/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const knexLib = require('knex');
const seedrandom = require('seedrandom');
const { createSqliteSchema } = require('./sqliteSchema');

// ---------- CONFIG ----------
const SQLITE_OUT = path.join(process.cwd(), 'dev-data', 'demo.db');
const RNG_SEED = 'phil-demo-001';
const NUM_PIECES = 150;

// Prefer a full URL via SOURCE_DATABASE_URL or DATABASE_URL.
// Otherwise falls back to DB_HOST/DB_USER/DB_PW/DB_DATABASE.
const SRC_URL =
  process.env.SOURCE_DATABASE_URL ||
  process.env.DATABASE_URL ||
  null;
// --------------------------------

function ensureDirFor(file) {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function loadLookupsFromMySQL(srcKnex, dstKnex) {
  console.log('Copying lookups from MySQL…');

  // Turn OFF FKs on this connection BEFORE writes (outside tx)
  await dstKnex.raw('PRAGMA foreign_keys = OFF');

  // Copy simple tables first (order matters)
  const simpleTablesInOrder = [
    'conditions',
    'media_type',
    'medium_category',
    'publisher_category',
    'species_category',
    'publisher_options',  // depends on publisher_category
    'species_options',    // depends on species_category
    'composers'
  ];

  for (const t of simpleTablesInOrder) {
    const rows = await srcKnex(t).select('*');
    if (rows.length) await dstKnex.batchInsert(t, rows, 500);
    console.log(`  - ${t}: ${rows.length}`);
  }

  // medium_options needs FK cleanup (category_id/parent_id)
  const categories = await dstKnex('medium_category').select('id');
  const categorySet = new Set(categories.map(r => Number(r.id)));

  const optionsRows = await srcKnex('medium_options').select('*');

  // Any category IDs referenced but missing? Create placeholders.
  const missingCategoryIds = new Set(
    optionsRows
      .map(r => Number(r.category_id))
      .filter(id => Number.isFinite(id) && id !== 0 && !categorySet.has(id))
  );
  if (missingCategoryIds.size) {
    const placeholderCats = Array.from(missingCategoryIds).map(id => ({
      id,
      label: `[AUTO] category ${id}`,
    }));
    await dstKnex.batchInsert('medium_category', placeholderCats, 200);
    placeholderCats.forEach(c => categorySet.add(c.id));
    console.log(`  - medium_category: added ${placeholderCats.length} placeholder categories`);
  }

  // Normalize: 0 → NULL, bad cat → NULL (should be rare now), self-parent → NULL
  const sanitized = optionsRows.map(r => {
    const out = { ...r };
    const cat = Number(out.category_id);
    const par = Number(out.parent_id);
    if (!Number.isFinite(cat) || cat === 0 || !categorySet.has(cat)) out.category_id = null;
    if (!Number.isFinite(par) || par === 0 || par === Number(out.id)) out.parent_id = null;
    return out;
  });

  // Pass 1: insert without parent links
  const pass1 = sanitized.map(r => ({ ...r, parent_id: null }));
  if (pass1.length) await dstKnex.batchInsert('medium_options', pass1, 500);
  console.log(`  - medium_options: inserted ${pass1.length} (pass 1, no parents)`);

  // Pass 2: link parents where they exist
  const existingIds = new Set((await dstKnex('medium_options').select('id')).map(r => Number(r.id)));
  let updates = 0;
  for (const r of sanitized) {
    const pid = r.parent_id != null ? Number(r.parent_id) : null;
    if (pid && existingIds.has(pid)) {
      await dstKnex('medium_options').where({ id: r.id }).update({ parent_id: pid });
      updates++;
    }
  }
  console.log(`  - medium_options: linked ${updates} parent_id references (pass 2)`);

  // Back ON
  await dstKnex.raw('PRAGMA foreign_keys = ON');
}

async function ensureMinimalLookups(dstKnex) {
  console.log('No MySQL source provided → seeding minimal lookups so we can generate pieces.');
  await dstKnex('conditions')
    .insert([{ id: 1, label: 'Good' }, { id: 2, label: 'Fair' }])
    .onConflict('id').ignore();

  await dstKnex('publisher_category')
    .insert([{ id: 1, label: 'Default' }]).onConflict('id').ignore();
  await dstKnex('publisher_options')
    .insert([{ id: 1, abbr: 'PUB', label: 'Publisher', publisher_category_id: 1 }])
    .onConflict('id').ignore();

  await dstKnex('species_category')
    .insert([{ id: 1, label: 'Default' }]).onConflict('id').ignore();
  await dstKnex('species_options')
    .insert([{ id: 1, abbr: 'ORCH', label: 'Orchestra', species_category_id: 1 }])
    .onConflict('id').ignore();

  await dstKnex('medium_category')
    .insert([{ id: 6, label: 'Orchestral' }]).onConflict('id').ignore();
  await dstKnex('medium_options')
    .insert([{ id: 25, value: '61', label: 'Full orchestra', category_id: 6, parent_id: 6 }])
    .onConflict('id').ignore();

  await dstKnex('composers')
    .insert([
      { id: 1, last_name: 'Beethoven', first_name: 'Ludwig', cutter_number: 'B415' },
      { id: 2, last_name: 'Stravinsky', first_name: 'Igor', cutter_number: 'S915' },
    ])
    .onConflict('id').ignore();
}

function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
function maybe(rng, p, val) { return rng() < p ? val() : null; }
function int(rng, a, b) { return a + Math.floor(rng() * (b - a + 1)); }
function dateStr(y, m, d) { const mm = String(m).padStart(2, '0'); const dd = String(d).padStart(2, '0'); return `${y}-${mm}-${dd}`; }

async function generatePieces(dstKnex, n, rng) {
  const composers = await dstKnex('composers').select('id');
  const publishers = await dstKnex('publisher_options').select('id');
  const species = await dstKnex('species_options').select('id');
  const mediums = await dstKnex('medium_options').select('id');
  const conditions = await dstKnex('conditions').select('id');

  if (!composers.length || !publishers.length || !species.length || !mediums.length || !conditions.length) {
    console.warn('⚠️  Missing lookup data — pieces will fail FK checks. Add lookups or run with SOURCE_DATABASE_URL.');
    return;
  }

  const forms = ['Symphony', 'Concerto', 'Suite', 'Overture', 'Rhapsody', 'Nocturne', 'Poem', 'Variations', 'Dance'];
  const keys  = ['C', 'G', 'D', 'A', 'E', 'B♭', 'F', 'E♭', 'A♭', 'D♭', 'F♯', 'C♯'];

  await dstKnex.transaction(async (trx) => {
    for (let i = 0; i < n; i++) {
      const c = pick(rng, composers);
      const sp = pick(rng, species);
      const m  = pick(rng, mediums);
      const p  = pick(rng, publishers);
      const cond = pick(rng, conditions);

      const form = pick(rng, forms);
      const num = maybe(rng, 0.6, () => `No. ${int(rng, 1, 12)}`);
      const key = maybe(rng, 0.7, () => `in ${pick(rng, keys)}`);
      const title = [form, num, key].filter(Boolean).join(' ');

      const pubDomain = int(rng, 0, 1);
      const ownPhys = int(rng, 0, 1);
      const ownDig = int(rng, 0, 1);
      const missing = int(rng, 0, 1);
      const idLabel = maybe(rng, 0.5, () => pick(rng, ['Op.', 'K.', 'BWV', 'H.']));
      const idVal = idLabel ? int(rng, 1, 999) : null;
      const acq = maybe(rng, 0.4, () => dateStr(int(rng, 1995, 2024), int(rng, 1, 12), int(rng, 1, 28)));
      const lastPerf = maybe(rng, 0.5, () => dateStr(int(rng, 2005, 2024), int(rng, 1, 12), int(rng, 1, 28)));

      await trx('pieces').insert({
        title,
        number: maybe(rng, 0.35, () => String(int(rng, 1, 10))),
        composer_id: c.id,
        species_id: sp.id,
        medium_id: m.id,
        publisher_id: p.id,
        condition_id: cond.id,
        public_domain: pubDomain,
        additional_notes: maybe(rng, 0.3, () => 'Demo note'),
        own_physical: ownPhys,
        own_digital: ownDig,
        missing_parts: missing,
        call_number: maybe(rng, 0.25, () => `M${int(rng, 1, 999)}.${int(rng, 1, 99)}`),
        identifier_label: idLabel,
        identifier_value: idVal,
        acquisition_date: acq,
        scans_url: maybe(rng, 0.2, () => 'https://example.invalid/scan.pdf'),
        date_last_performed: lastPerf,
      });
    }

    await trx('admins').insert({ netid: 'demo', name: 'Demo Admin' }).catch(() => {});
  });

  console.log(`Generated ${n} demo pieces.`);
}

async function main() {
  ensureDirFor(SQLITE_OUT);
  if (fs.existsSync(SQLITE_OUT)) fs.unlinkSync(SQLITE_OUT);

  const dst = knexLib({
    client: 'sqlite3',
    connection: { filename: SQLITE_OUT },
    useNullAsDefault: true,
  });

  // Optional MySQL source
  let src = null;
  if (!SRC_URL && process.env.DB_HOST && process.env.DB_USER && process.env.DB_DATABASE) {
    // build a connection from discrete vars
    src = knexLib({
      client: 'mysql2',
      connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PW || '',
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      },
    });
  } else if (SRC_URL) {
    src = knexLib({ client: 'mysql2', connection: SRC_URL });
  }

  try {
    console.log(`Creating schema → ${SQLITE_OUT}`);
    await createSqliteSchema(dst);

    if (src) {
      console.log('Connecting to MySQL to copy lookups…');
      await loadLookupsFromMySQL(src, dst);
    } else {
      await ensureMinimalLookups(dst);
    }

    const rng = seedrandom(RNG_SEED);
    await generatePieces(dst, NUM_PIECES, rng);

    console.log('✅ Demo DB ready:', SQLITE_OUT);
    console.log('Tip: set SQLITE_FILE=' + SQLITE_OUT + ' when running APP_MODE=demo.');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await Promise.allSettled([src?.destroy?.(), dst.destroy()]);
  }
}

if (require.main === module) main();
