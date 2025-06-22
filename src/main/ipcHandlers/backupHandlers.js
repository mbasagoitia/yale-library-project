const {
  createMysqlDump,
  createReadableBackup,
  zipFolder
} = require("../helpers/backupHelpers");

const handleBackupHandlers = (ipcMain, store) => {
  // Namespace: backup
  ipcMain.handle('backup:createMySQL', () => {
    return createMysqlDump(store);
  });

  ipcMain.handle('backup:createReadable', () => {
    return createReadableBackup(store);
  });

  ipcMain.handle('backup:zipCatalogue', () => {
    return zipFolder(store);
  });
};

module.exports = handleBackupHandlers;
