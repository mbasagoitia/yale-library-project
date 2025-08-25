const path = require('path');
const fs = require('fs');

const {
  checkDefaultBasePath,
  getBasePath,
  chooseFolder,
  setBasePath,
  handleReadFile,
  handleOpenFile,
  handleOpenFolder,
  handleListDirectory
} = require("../helpers/fileHelpers");

const IS_DEMO =
  process.env.APP_MODE === 'demo' ||
  process.env.REACT_APP_APP_MODE === 'demo' ||
  String(process.env.REACT_APP_CAS_ENABLED || '').toLowerCase() === 'false';

function resolveDemoBase() {
  const devDir = path.join(process.cwd(), 'src', 'assets', 'demo', 'digital-catalogue');
  const prodDir = path.join(process.resourcesPath, 'demo-catalogue');
  if (fs.existsSync(prodDir)) return prodDir;
  if (fs.existsSync(devDir)) return devDir;
  return null;
}

const handleFileHandlers = (ipcMain, store) => {

  ipcMain.handle('catalogue:listDirectory', (_, path) => {
    return handleListDirectory(store, path);
  });

  ipcMain.handle('fs:checkDefaultBasePath', () => {
    return checkDefaultBasePath();
  });

  // Get digital catalogue base path
  ipcMain.handle('fs:getBasePath', () => {
    if (IS_DEMO) {
      const demoBase = resolveDemoBase();
      return demoBase;
    }
    return getBasePath(store);
  });

  ipcMain.handle('fs:setBasePath', (_, newPath) => {
    return setBasePath(store, newPath);
  });

  ipcMain.handle('fs:chooseFolder', (_, defaultPath) => {
    return chooseFolder(store, defaultPath);
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