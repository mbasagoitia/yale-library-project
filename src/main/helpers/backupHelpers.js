const { dialog } = require('electron');
const path = require("path");
const fs = require('fs-extra');
const { pipeline } = require('stream');
const { promisify } = require('util');
const streamPipeline = promisify(pipeline);
const archiver = require("archiver");

const createReadableBackup = async (mainWindow, store) => {
  const token = store.get("authToken");
  if (!token) {
    return { success: false, message: "You must be logged in to create a CSV backup." };
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
    title: "Save CSV Backup",
    defaultPath: `readable_backup_${timestamp}.csv`,
    filters: [{ name: "CSV File", extensions: ["csv"] }],
  });

  if (canceled || !filePath) {
    return { success: false, message: "Backup cancelled by user." };
  }

  try {
    const backupUrl = `http://localhost:5000/api/backup/readable?filePath=${encodeURIComponent(filePath)}`;
    const res = await fetch(backupUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return { success: false, message: `Backup failed: ${res.statusText}` };
    }

    await streamPipeline(res.body, fs.createWriteStream(filePath));

    return { success: true, filePath };
  } catch (err) {
    console.error("Readable backup failed:", err);
    return { success: false, message: "Unexpected error during CSV backup." };
  }
};

const createMysqlDump = async (mainWindow, store) => {
  const token = store.get("authToken");
  if (!token) {
    return { success: false, message: "You must be logged in to create a MySQL backup." };
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
    title: "Save MySQL Dump",
    defaultPath: `mysqldump_${timestamp}.sql`,
    filters: [{ name: "SQL File", extensions: ["sql"] }],
  });

  if (canceled || !filePath) {
    return { success: false, message: "Backup cancelled by user." };
  }

  try {
    const backupUrl = `http://localhost:5000/api/backup/mysqldump?filePath=${encodeURIComponent(filePath)}`;
    const res = await fetch(backupUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return { success: false, message: `Backup failed: ${res.statusText}` };
    }

    await streamPipeline(res.body, fs.createWriteStream(filePath));

    return { success: true, filePath };
  } catch (err) {
    console.error("MySQL dump failed:", err);
    return { success: false, message: "Unexpected error during MySQL backup." };
  }
};

const zipFolder = async (store) => {
  const baseFolder = store.get("basePath");
  if (!baseFolder) {
    return { success: false, message: "No base path set in settings." };
  }

  try {
    const backupFolder = path.join(baseFolder, '..', 'backups');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const zipPath = path.join(backupFolder, `digital_catalogue_backup_${timestamp}.zip`);

    await fs.ensureDir(backupFolder);

    return await new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => resolve({ success: true, filePath: zipPath }));
      archive.on('error', (err) => {
        console.error("Zip archive error:", err);
        reject({ success: false, message: "Failed to zip catalogue." });
      });

      archive.pipe(output);
      archive.directory(baseFolder, false);
      archive.finalize();
    });
  } catch (err) {
    console.error("Zipping failed:", err);
    return { success: false, message: "Unexpected error during backup. Please try logging in again." };
  }
};

module.exports = {
  createMysqlDump,
  createReadableBackup,
  zipFolder,
};
