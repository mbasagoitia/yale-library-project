const path = require('path');
const {
  getAllFolders,
  getBasePath,
  setBasePath,
  handleSelectBasePath,
  handleReadFile,
  handleReadFolder,
  handleOpenFile,
  handleOpenFolder,
  handleListDirectory
} = require("../helpers/fileHelpers");

const handleFileHandlers = (ipcMain, store, mainWindow) => {
  // Namespace: digitalCatalogue
  ipcMain.handle('catalogue:getAllFolders', (_, basePath) => {
    return getAllFolders(basePath);
  });

  ipcMain.handle('catalogue:listDirectory', (_, relativePath) => {
    return handleListDirectory(store, relativePath);
  });

  // Namespace: filesystem
  ipcMain.handle('fs:getBasePath', () => {
    return getBasePath(store);
  });

  ipcMain.handle('fs:setBasePath', (_, newPath) => {
    return setBasePath(store, newPath, mainWindow);
  });

  ipcMain.handle('fs:selectBasePath', () => {
    return handleSelectBasePath(store, mainWindow);
  });

  ipcMain.handle('fs:getFullPath', (_, basePath, relativePath) => {
    return path.join(basePath, relativePath);
  });

  ipcMain.handle('fs:readFile', (_, filePath) => {
    return handleReadFile(filePath);
  });

  ipcMain.handle('fs:readFolder', (_, folderPath) => {
    return handleReadFolder(folderPath);
  });

  ipcMain.handle('fs:openFile', (_, filePath) => {
    return handleOpenFile(filePath);
  });

  ipcMain.handle('fs:openFolder', (_, folderPath) => {
    return handleOpenFolder(folderPath);
  });
};

module.exports = handleFileHandlers;
