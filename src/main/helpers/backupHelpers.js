const path = require("path");
const fs = require('fs-extra');
const { pipeline } = require('stream');
const { promisify } = require('util');
const streamPipeline = promisify(pipeline);
const archiver = require("archiver");

const createReadableBackup = async (store) => {
  const token = store.get("authToken");
  if (!token) {
    return { success: false, message: "You must be logged in to create a CSV backup." };
  }

  const baseFolder = store.get("basePath");
  if (!baseFolder) {
    return { success: false, message: "No base path set in settings." };
  }

  try {
    // Ensure backups folder exists next to base path
    const backupFolder = path.join(baseFolder, '..', 'backups');
    await fs.ensureDir(backupFolder);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(backupFolder, `library_backup_${timestamp}.csv`);

    const backupUrl = `http://localhost:5000/api/backup/readable?filePath=${encodeURIComponent(filePath)}`;
    const res = await fetch(backupUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return { success: false, message: `Backup failed: ${res.statusText}` };
    }

    // Save the streamed CSV directly into the backups folder
    await streamPipeline(res.body, fs.createWriteStream(filePath));

    return { success: true, filePath };
  } catch (err) {
    return { success: false, message: "Unexpected error during CSV backup." };
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
      archive.on('error', () => {
        reject({ success: false, message: "Failed to zip catalogue." });
      });

      archive.pipe(output);
      archive.directory(baseFolder, false);
      archive.finalize();
    });
  } catch (err) {
    return { success: false, message: "Unexpected error during backup. Please try again." };
  }
};

module.exports = {
  createReadableBackup,
  zipFolder,
};
