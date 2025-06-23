const path = require('path');
const {
  getBasePath,
  setBasePath,
  handleReadFile,
  handleOpenFile,
  handleOpenFolder,
  handleListDirectory
} = require("../helpers/fileHelpers");

const handleFileHandlers = (ipcMain, store, mainWindow) => {

  // Namespace: digitalCatalogue
  ipcMain.handle('catalogue:listDirectory', (_, relativePath) => {
    return handleListDirectory(store, relativePath);
  });

  // Namespace: filesystem
  ipcMain.handle('fs:getBasePath', () => {
    return getBasePath(store);
  });

  ipcMain.handle('fs:setBasePath', () => {
    return setBasePath(store, mainWindow);
  });

  ipcMain.handle('fs:getFullPath', (_, basePath, relativePath) => {
    return path.join(basePath, relativePath);
  });

  ipcMain.handle('fs:readFile', (_, filePath) => {
    return handleReadFile(filePath);
  });

  ipcMain.handle('fs:openFile', (_, filePath) => {
    return handleOpenFile(filePath);
  });

  ipcMain.handle('fs:openFolder', (_, folderPath) => {
    return handleOpenFolder(folderPath);
  });
};

module.exports = handleFileHandlers;
