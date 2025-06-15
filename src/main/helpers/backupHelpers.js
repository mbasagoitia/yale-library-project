const fs = require('fs-extra');
const { parse } = require('json2csv');
const archiver = require('archiver');
const mysqldump = require('mysqldump');
const { dialog } = require('electron');

const exportReadableBackup = async (mainWindow, pool) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.title AS Title,
        c.last_name AS composer_lastname,
        c.first_name AS composer_firstname,
        pub.label AS publisher,
        p.additional_notes AS additional_notes,
        con.label AS condition_description,
        p.call_number,
        p.acquisition_date
      FROM pieces p
        INNER JOIN composers c ON p.composer_id = c.id 
        INNER JOIN publisher_options pub ON p.publisher_id = pub.id
        INNER JOIN conditions con ON p.condition_id = con.id
      ORDER BY c.last_name ASC, p.title ASC;
    `);

    const csv = parse(rows);

    const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
      title: 'Save Spreadsheet-Friendly Backup',
      defaultPath: `holdings_backup_${new Date().toISOString().split('T')[0]}.csv`,
      filters: [{ name: 'CSV Files', extensions: ['csv'] }]
    });

    if (canceled || !filePath) {
      return { success: false, message: 'Backup cancelled' };
    }

    fs.writeFileSync(filePath, csv, 'utf8');
    return { success: true, message: `Backup saved to ${filePath}` };

  } catch (error) {
    console.error('CSV export failed:', error);
    return { success: false, message: 'Failed to export CSV backup.' };
  }
};

const exportMySQLDump = async (mainWindow) => {
  try {
    const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
      title: 'Save Full MySQL Backup',
      defaultPath: `full_db_backup_${new Date().toISOString().split('T')[0]}.sql`,
      filters: [{ name: 'SQL Files', extensions: ['sql'] }]
    });

    if (canceled || !filePath) {
      return { success: false, message: 'Backup cancelled' };
    }

    await mysqldump({
      connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_DATABASE
      },
      dumpToFile: filePath
    });

    return { success: true, message: `Full database backup saved to ${filePath}` };

  } catch (error) {
    console.error('MySQL dump failed:', error);
    return { success: false, message: 'Failed to export full database backup.' };
  }
};

const zipFolder = (sourceFolderPath, outputZipPath) => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputZipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => resolve(outputZipPath));
    archive.on('error', (err) => reject(err));

    archive.pipe(output);
    archive.directory(sourceFolderPath, false);
    archive.finalize();
  });
};

module.exports = {
  exportReadableBackup,
  exportMySQLDump,
  zipFolder
};
