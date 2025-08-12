const fs = require('fs-extra');
const path = require('path');
const { parse } = require('json2csv');
const mysqldump = require("mysqldump");

const exportReadableBackup = (pool, filePath) => {
  return new Promise((resolve, reject) => {
    pool.query(`
      SELECT 
        p.title AS Title,
        c.last_name AS composer_lastname,
        c.first_name AS composer_firstname,
        pub.label AS publisher,
        p.additional_notes AS additional_notes,
        con.label AS condition_description,
        p.call_number,
        p.acquisition_date,
        p.date_last_performed
      FROM pieces p
        INNER JOIN composers c ON p.composer_id = c.id 
        INNER JOIN publisher_options pub ON p.publisher_id = pub.id
        INNER JOIN conditions con ON p.condition_id = con.id
      ORDER BY c.last_name ASC, p.title ASC;
    `, async (err, rows) => {
      if (err) {
        return resolve({ success: false, message: 'Failed to export CSV backup.' });
      }

      try {
        const csv = parse(rows);
        await fs.ensureDir(path.dirname(filePath));
        await fs.writeFile(filePath, csv, 'utf8');
        resolve({ success: true, filePath });
      } catch (error) {
        resolve({ success: false, message: 'Failed to write CSV file.' });
      }
    });
  });
};

const exportMySQLDump = async (filePath) => {
  try {
    await fs.ensureDir(require('path').dirname(filePath));

    await mysqldump({
      connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_DATABASE
      },
      dumpToFile: filePath
    });

    return { success: true, filePath };
  } catch (error) {
    return { success: false, message: 'Failed to export full database backup.' };
  }
};

module.exports = {
  exportReadableBackup,
  exportMySQLDump
};
