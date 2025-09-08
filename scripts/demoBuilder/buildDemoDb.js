const fs = require('fs');
const path = require('path');
const knexLib = require('knex');
const seedrandom = require('seedrandom');
const { createSqliteSchema } = require('./sqliteSchema');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const SQLITE_OUT = path.join(process.cwd(), 'dev-data', 'demo.db');
const RNG_SEED = 'phil-demo-001';
const NUM_PIECES = 150;

function ensureDirFor(file) {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Copy lookups from remote DB into SQLite
async function copyLookups(srcKnex, dstKnex) {
  try {
    await loadLookupsFromMySQL(srcKnex, dstKnex);
  } catch (err) {
    console.warn("Could not connect to remote DB, seeding minimal lookups instead.");
    await ensureMinimalLookups(dstKnex);
  }
}

async function loadLookupsFromMySQL(srcKnex, dstKnex) {
  console.log('Copying lookups from MySQL…');
  await dstKnex.raw('PRAGMA foreign_keys = OFF');

  const simpleTablesInOrder = [
    'conditions',
    'media_type',
    'medium_category',
    'publisher_category',
    'species_category',
    'publisher_options',
    'species_options',
    'composers'
  ];

  for (const t of simpleTablesInOrder) {
    const rows = await srcKnex(t).select('*');
    if (rows.length) await dstKnex.batchInsert(t, rows, 500);
    console.log(`  - ${t}: ${rows.length}`);
  }

  // medium_options requires cleanup for parent/category FKs
  const categories = await dstKnex('medium_category').select('id');
  const categorySet = new Set(categories.map(r => Number(r.id)));

  const optionsRows = await srcKnex('medium_options').select('*');
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

  const sanitized = optionsRows.map(r => {
    const out = { ...r };
    const cat = Number(out.category_id);
    const par = Number(out.parent_id);
    if (!Number.isFinite(cat) || cat === 0 || !categorySet.has(cat)) out.category_id = null;
    if (!Number.isFinite(par) || par === 0 || par === Number(out.id)) out.parent_id = null;
    return out;
  });

  const pass1 = sanitized.map(r => ({ ...r, parent_id: null }));
  if (pass1.length) await dstKnex.batchInsert('medium_options', pass1, 500);
  console.log(`  - medium_options: inserted ${pass1.length} (pass 1, no parents)`);

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

  await dstKnex.raw('PRAGMA foreign_keys = ON');
}

async function ensureMinimalLookups(dstKnex) {
  console.log('Seeding minimal lookups for demo build…');
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
    console.warn('⚠️ Missing lookup data — pieces will fail FK checks.');
    return;
  }

  const forms = ['Symphony', 'Concerto', 'Suite', 'Overture', 'Rhapsody', 'Nocturne', 'Poem', 'Variations', 'Dance'];
  const keys  = ['C', 'G', 'D', 'A', 'E', 'B', 'F', 'E', 'A', 'D', 'F', 'C'];

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
        public_domain: int(rng, 0, 1),
        additional_notes: maybe(rng, 0.3, () => 'Demo note'),
        own_physical: int(rng, 0, 1),
        own_digital: int(rng, 0, 1),
        missing_parts: int(rng, 0, 1),
        call_number: maybe(rng, 0.25, () => `M${int(rng, 1, 999)}.${int(rng, 1, 99)}`),
        identifier_label: maybe(rng, 0.5, () => pick(rng, ['Op.', 'K.', 'BWV', 'H.'])),
        identifier_value: maybe(rng, 0.5, () => int(rng, 1, 999)),
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
  // 1. Remote connection (source lookups)
  const src = knexLib({
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PW || '',
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    },
  });

  // 2. Local SQLite demo file (destination)
  ensureDirFor(SQLITE_OUT);
  if (fs.existsSync(SQLITE_OUT)) fs.unlinkSync(SQLITE_OUT);
  const dst = knexLib({
    client: 'sqlite3',
    connection: { filename: SQLITE_OUT },
    useNullAsDefault: true,
  });

  try {
    console.log("🛠 Creating schema in SQLite…");
    await createSqliteSchema(dst);

    console.log("📥 Loading lookup data…");
    await copyLookups(src, dst);

    console.log("🎲 Generating demo pieces…");
    const rng = seedrandom(RNG_SEED);
    await generatePieces(dst, NUM_PIECES, rng);

    console.log(`✅ Demo SQLite built at ${SQLITE_OUT}`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await src.destroy();
    await dst.destroy();
  }
}

if (require.main === module) main();
