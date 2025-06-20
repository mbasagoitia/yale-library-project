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

  ipcMain.handle('digitalCatalogue:getAllFolders', async (_, basePath) => {
    return await getAllFolders(basePath);
  });
  
  ipcMain.handle('get-base-path', async () => {
    return getBasePath(store);
  });

  ipcMain.handle('set-base-path', async (event, newPath) => {
    return setBasePath(store, newPath, mainWindow);
  });

  ipcMain.handle('select-base-path', async () => {
    return await handleSelectBasePath(store, mainWindow);
  });

  ipcMain.handle('get-full-path', (event, basePath, relativePath) => {
    return path.join(basePath, relativePath);
  });

  ipcMain.handle('read-file', async (event, filePath) => {
    return await handleReadFile(filePath);
  });

  ipcMain.handle('read-folder', async (event, folderPath) => {
    return await handleReadFolder(folderPath);
  });

  ipcMain.handle('open-file', async (event, filePath) => {
    return await handleOpenFile(filePath);
  });

  ipcMain.handle('open-folder', async (event, folderPath) => {
    return await handleOpenFolder(folderPath);
  });

  ipcMain.handle('digitalCatalogue:listDirectory', async (event, relativePath) => {
    return await handleListDirectory(store, relativePath);
  });
};

module.exports = handleFileHandlers;
