const fs = require('fs-extra');
const path = require('path');

const {
  exportReadableBackup,
  exportMySQLDump,
  zipFolder
} = require("../helpers/backupHelpers");

const handleBackupHandlers = (ipcMain, store, pool) => {
  ipcMain.handle('backup:zipCatalogueFolder', async () => {
    const baseFolder = store.get("basePath");
    if (!baseFolder) throw new Error("No base path set.");

    const backupFolder = path.join(baseFolder, '..', 'backups');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const zipPath = path.join(backupFolder, `digital_catalogue_backup_${timestamp}.zip`);

    await fs.ensureDir(backupFolder);
    await zipFolder(baseFolder, zipPath);

    return zipPath;
  });

  ipcMain.handle('backup:readable', async () => {
    const baseFolder = store.get("basePath");
    if (!baseFolder) throw new Error("No base path set.");
    return await exportReadableBackup(pool, baseFolder);
  });
  
  ipcMain.handle('backup:mysqldump', async () => {
    const baseFolder = store.get("basePath");
    if (!baseFolder) throw new Error("No base path set.");
    return await exportMySQLDump(baseFolder);
  });
};

module.exports = handleBackupHandlers;
