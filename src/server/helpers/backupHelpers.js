const fs = require('fs-extra');
const path = require('path');
const { parse } = require('json2csv');
const mysqldump = require('mysqldump');

function knexClient(db) {
  return (db && db.client && db.client.config && db.client.config.client) || '';
}

function mysqlConnFromKnex(db) {
  const conn = db?.client?.config?.connection;
  if (!conn) return null;

  if (typeof conn === 'string') {
    try {
      const u = new URL(conn);
      return {
        host: u.hostname,
        port: u.port ? Number(u.port) : 3306,
        user: decodeURIComponent(u.username || ''),
        password: decodeURIComponent(u.password || ''),
        database: (u.pathname || '').replace(/^\//, ''),
        socketPath: u.searchParams.get('socketPath') || undefined,
      };
    } catch {
      return null;
    }
  }

  return {
    host: conn.host || '127.0.0.1',
    port: conn.port ? Number(conn.port) : 3306,
    user: conn.user,
    password: conn.password,
    database: conn.database,
    socketPath: conn.socketPath,
  };
}

/**
 * Export a human-readable CSV from join of pieces + lookups.
 * Works on MySQL & SQLite (portable Knex query).
 *
 * @param {import('knex').Knex} db
 * @param {string} filePath - destination CSV path
 * @returns {Promise<{success:boolean, filePath?:string, message?:string}>}
 */
async function exportReadableBackup(db, filePath) {
  try {
    const rows = await db('pieces as p')
      .innerJoin('composers as c', 'p.composer_id', 'c.id')
      .innerJoin('publisher_options as pub', 'p.publisher_id', 'pub.id')
      .innerJoin('conditions as con', 'p.condition_id', 'con.id')
      .select(
        db.ref('p.title').as('Title'),
        db.ref('c.last_name').as('composer_lastname'),
        db.ref('c.first_name').as('composer_firstname'),
        db.ref('pub.label').as('publisher'),
        db.ref('p.additional_notes').as('additional_notes'),
        db.ref('con.label').as('condition_description'),
        db.ref('p.call_number').as('call_number'),
        db.ref('p.acquisition_date').as('acquisition_date'),
        db.ref('p.date_last_performed').as('date_last_performed'),
      )
      .orderBy([{ column: 'c.last_name', order: 'asc' }, { column: 'p.title', order: 'asc' }]);

    const csv = parse(rows, {
      fields: [
        'Title',
        'composer_lastname',
        'composer_firstname',
        'publisher',
        'additional_notes',
        'condition_description',
        'call_number',
        'acquisition_date',
        'date_last_performed',
      ],
    });

    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, csv, 'utf8');

    return { success: true, filePath };
  } catch (error) {
    return { success: false, message: 'Failed to export CSV backup.' };
  }
}

/**
 * Export a full database backup.
 * - MySQL: writes a .sql dump (mysqldump)
 * - SQLite: writes a consistent .db snapshot (VACUUM INTO) or copies the file
 *
 * @param {import('knex').Knex} db
 * @param {string} filePath - destination .sql (MySQL) or .db (SQLite)
 * @returns {Promise<{success:boolean, filePath?:string, message?:string}>}
 */
async function exportDatabaseBackup(db, filePath) {
  const client = knexClient(db);
  try {
    await fs.ensureDir(path.dirname(filePath));

    if (client === 'mysql2') {
      const conn = mysqlConnFromKnex(db);
      if (!conn) throw new Error('Could not read MySQL connection from Knex');

      await mysqldump({
        connection: conn,
        dumpToFile: filePath,
      });

      return { success: true, filePath };
    }

    if (client === 'sqlite3') {
      // Prefer SQLite's atomic snapshot if supported (3.27+)
      try {
        // Ensure absolute path (SQLite expects a real path)
        const abs = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);
        // Escape single quotes for SQL string literal
        const absSql = abs.replace(/'/g, "''");
        await db.raw(`VACUUM INTO '${absSql}'`);
        return { success: true, filePath: abs };
      } catch {
        // Fallback: copy the DB file (may capture WAL; acceptable for a simple backup)
        const src = db?.client?.config?.connection?.filename;
        if (!src) throw new Error('Could not resolve SQLite filename from Knex');
        await fs.copy(src, filePath);
        return { success: true, filePath };
      }
    }

    // Fallback message for other engines
    return { success: false, message: `Unsupported client "${client}" for backup.` };
  } catch (error) {
    return { success: false, message: 'Failed to export full database backup.' };
  }
}

module.exports = {
  exportReadableBackup,
  exportDatabaseBackup,
};
