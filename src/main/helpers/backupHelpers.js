const fs = require('fs-extra');
const path = require('path');
const { pipeline } = require('stream');
const { promisify } = require('util');
const streamPipeline = promisify(pipeline);

const createMysqlDump = async (store) => {

  const basePath = store.get("basePath");
  const token = store.get("authToken");

  const backupUrl = `http://localhost:5000/api/backup/mysqldump?basePath=${encodeURIComponent(basePath)}`;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(basePath, `mysqldump_${timestamp}.sql`);

  const res = await fetch(backupUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    }});

  if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);

  await fs.ensureDir(basePath);
  await streamPipeline(res.body, fs.createWriteStream(filePath));

  return filePath;
};

const createReadableBackup = async (store) => {
  // Why do I need a base path for this?
  const basePath = store.get("basePath");
  if (!basePath) throw new Error("No base path set.");
  const token = store.get("authToken");

  const backupUrl = `http://localhost:5000/api/backup/readable?basePath=${encodeURIComponent(basePath)}`;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(basePath, `readable_backup_${timestamp}.csv`);

  const res = await fetch(backupUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    }});

  if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);

  await fs.ensureDir(basePath);
  await streamPipeline(res.body, fs.createWriteStream(filePath));

  return filePath;
};

const zipFolder = async (store) => {
  const baseFolder = store.get("basePath");
  if (!baseFolder) throw new Error("No base path set.");

  const backupFolder = path.join(baseFolder, '..', 'backups');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const zipPath = path.join(backupFolder, `digital_catalogue_backup_${timestamp}.zip`);

  await fs.ensureDir(backupFolder);

  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => resolve(zipPath));
    archive.on('error', reject);

    archive.pipe(output);
    archive.directory(baseFolder, false);
    archive.finalize();
  });
};

module.exports = {
  createMysqlDump,
  createReadableBackup,
  zipFolder
};
