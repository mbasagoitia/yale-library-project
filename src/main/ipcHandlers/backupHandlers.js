const {
  createMysqlDump,
  createReadableBackup,
  zipFolder
} = require("../helpers/backupHelpers");

const handleBackupHandlers = (ipcMain, store, mainWindow) => {

  ipcMain.handle('backup:createMySQL', async () => {
    return await createMysqlDump(mainWindow, store);
  });

  ipcMain.handle('backup:createReadable', async () => {
    return await createReadableBackup(mainWindow, store);
  });

  ipcMain.handle('backup:zipCatalogue', async () => {
    return await zipFolder(store);
  });
};

module.exports = handleBackupHandlers;
