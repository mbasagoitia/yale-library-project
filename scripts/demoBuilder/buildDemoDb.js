/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const knexLib = require("knex");
require("dotenv").config(); // load .env at project root

// ---------- CONFIG ----------
const SQLITE_OUT = path.join(process.cwd(), "demo-data", "demo.db");
const SAMPLE_SIZE = 75; // number of pieces to copy
// ----------------------------

function ensureDirFor(file) { 
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function copyLookups(src, dst) {
  console.log("Copying lookup tables...");

  const lookupTables = [
    "conditions",
    "media_type",
    "medium_category",
    "publisher_category",
    "species_category",
    "publisher_options",
    "species_options",
    "medium_options",
    "composers",
  ];

  for (const table of lookupTables) {
    const rows = await src(table).select("*");
    if (rows.length) await dst.batchInsert(table, rows, 500);
    console.log(`  - ${table}: ${rows.length}`);
  }
}

async function copySamplePieces(src, dst) {
  console.log(`Copying random sample of ${SAMPLE_SIZE} pieces...`);

  const rows = await src("pieces")
    .select("*")
    .orderByRaw("RAND()") // MySQL random order
    .limit(SAMPLE_SIZE);

  if (rows.length) await dst.batchInsert("pieces", rows, 500);

  console.log(`  - pieces: ${rows.length}`);
}

async function main() {

  // 1. Remote MySQL connection
  const src = knexLib({
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PW || "",
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    },
  });

  // 2. Local SQLite file
  ensureDirFor(SQLITE_OUT);
  if (fs.existsSync(SQLITE_OUT)) fs.unlinkSync(SQLITE_OUT);

  const dst = knexLib({
    client: "sqlite3",
    connection: { filename: SQLITE_OUT },
    useNullAsDefault: true,
  });

  // Turn off foreign key constraints

  try {
    console.log("🛠 Creating schema in SQLite...");
    const { createSqliteSchema } = require("./sqliteSchema");
    await createSqliteSchema(dst);

    console.log("Copying lookup data...");
    await copyLookups(src, dst);

    console.log("Copying piece sample...");
    await copySamplePieces(src, dst);

    console.log(`Demo SQLite built at ${SQLITE_OUT}`);
  } catch (e) {
    console.error("Error:", e);
    process.exit(1);
  } finally {
    await src.destroy();
    await dst.destroy();
  }
}

if (require.main === module) main();
