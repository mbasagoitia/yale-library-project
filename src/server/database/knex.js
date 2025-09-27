const path = require('path');
const knexLib = require('knex');
const { isDev, appConfig } = require("../../main/helpers/config.js");

function sqlitePath() {
  const mode = appConfig.APP_MODE || 'demo';

  if (mode === 'demo' && isDev) {
    const dbPath = path.resolve(process.cwd(), process.env.SQLITE_FILE);
    console.log("Knex: Using dev sqlite file:", dbPath);
    return dbPath;
  } else {
    const dbPath = path.join(process.resourcesPath, 'demo.db');
    console.log("Knex: Using packaged sqlite file:", dbPath);
    return dbPath;
  }
}

function makeKnex() {
  const mode = appConfig.APP_MODE || 'demo';

  if (mode === 'internal') {
    return knexLib({
      client: 'mysql2',
      connection:
        {
          host: appConfig.DB_HOST,
          user: appConfig.DB_USER,
          password: appConfig.DB_PW,
          database: appConfig.DB_DATABASE,
          port: appConfig.DB_PORT ? Number(appConfig.DB_PORT) : 3306,
        },
      pool: { min: 0, max: 10 },
    });
  }

  console.log("Knex: Connecting to sqlite DB...");
  const filename = sqlitePath();
  console.log("Knex: DB filename =", filename);

  return knexLib({
    client: 'sqlite3',
    connection: { filename },
    useNullAsDefault: true,
  });
}

module.exports = makeKnex;
