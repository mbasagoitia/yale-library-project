const path = require('path');
const knexLib = require('knex');

function sqlitePath() {
  return (
    path.join(__dirname, process.env.SQLITE_FILE)
  );
}

function makeKnex() {
  const mode = process.env.APP_MODE || 'demo';

  if (mode === 'internal') {
    const url = process.env.DATABASE_URL;
    return knexLib({
      client: 'mysql2',
      connection:
        url || {
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PW,
          database: process.env.DB_DATABASE,
          port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
        },
      pool: { min: 0, max: 10 },
    });
  }

  // demo sqlite db
  return knexLib({
    client: 'sqlite3',
    connection: { filename: sqlitePath() },
    useNullAsDefault: true,
  });
}

module.exports = makeKnex;
