const mysqldump = require('mysqldump');
const path = require('path');
const { parse } = require('json2csv');

const exportReadableBackup = async (pool, baseFolder) => {
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
  
      const backupFolder = path.join(baseFolder, '..', 'backups');
      await fs.ensureDir(backupFolder);
  
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filePath = path.join(backupFolder, `holdings_backup_${timestamp}.csv`);
  
      fs.writeFileSync(filePath, csv, 'utf8');
  
      return { success: true, message: `Backup saved to ${filePath}` };
    } catch (error) {
      console.error('CSV export failed:', error);
      return { success: false, message: 'Failed to export CSV backup.' };
    }
  };
  
  
  const exportMySQLDump = async (baseFolder) => {
    try {
      const backupFolder = path.join(baseFolder, '..', 'backups');
      await fs.ensureDir(backupFolder);
  
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filePath = path.join(backupFolder, `full_db_backup_${timestamp}.sql`);
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

module.exports = {
    exportReadableBackup,
    exportMySQLDump
}