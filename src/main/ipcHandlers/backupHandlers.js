const {
  createReadableBackup,
  zipFolder
} = require("../helpers/backupHelpers");

const handleBackupHandlers = (ipcMain, store, mainWindow) => {

  ipcMain.handle('backup:createReadable', async () => {
    return await createReadableBackup(mainWindow, store);
  });

  ipcMain.handle('backup:zipCatalogue', async () => {
    return await zipFolder(store);
  });
};

module.exports = handleBackupHandlers;
