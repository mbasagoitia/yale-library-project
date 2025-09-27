const path = require("path");
const fs = require("fs-extra");
const { pipeline } = require("stream");
const { promisify } = require("util");
const archiver = require("archiver");
const { app } = require("electron");
const streamPipeline = promisify(pipeline);
const { appConfig } = require("../helpers/config.js");

const IS_DEMO = appConfig.APP_MODE === "demo";
const API_BASE = appConfig.API_BASE;

const getBackupFolder = () => {
  const documentsPath = app.getPath("documents");
  return path.join(documentsPath, "backups");
};

const createReadableBackup = async (store) => {
  try {
    const backupFolder = getBackupFolder();
    await fs.ensureDir(backupFolder);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filePath = path.join(backupFolder, `library_backup_${timestamp}.csv`);

    const backupUrl = `${API_BASE}/api/backup/readable?filePath=${encodeURIComponent(filePath)}`;
    const token = store.get("authToken");

    if (!token) {
      return { success: false, message: "Backup failed: No auth token found." };
    }

    const res = await fetch(backupUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });

    if (!res.ok) {
      return { success: false, message: `Backup failed: ${res.statusText}` };
    }

    await streamPipeline(res.body, fs.createWriteStream(filePath));

    return { success: true, filePath };
  } catch (err) {
    console.error("CSV backup failed:", err);
    return { success: false, message: "Unexpected error during CSV backup." };
  }
};


const zipFolder = async (store) => {
  try {
    const backupFolder = getBackupFolder();
    await fs.ensureDir(backupFolder);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const zipPath = path.join(backupFolder, `digital_catalogue_backup_${timestamp}.zip`);

    // Catalogue folder (still need to know what to zip)
    let baseFolder = "";
    if (IS_DEMO) {
      const { resolveDemoBase } = require("../helpers/fileHelpers.js");
      baseFolder = resolveDemoBase();
    } else {
      baseFolder = store.get("basePath");
    }

    if (!baseFolder) {
      return { success: false, message: "No base path set in settings." };
    }

    return await new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipPath);
      const archive = archiver("zip", { zlib: { level: 9 } });

      output.on("close", () => resolve({ success: true, filePath: zipPath }));
      archive.on("error", (err) => reject({ success: false, message: err.message }));

      archive.pipe(output);
      archive.directory(baseFolder, false);
      archive.finalize();
    });
  } catch (err) {
    console.error("ZIP backup failed:", err);
    return { success: false, message: "Unexpected error during backup. Please try again." };
  }
};

module.exports = {
  createReadableBackup,
  zipFolder,
};
