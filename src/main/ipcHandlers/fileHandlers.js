const { appConfig } = require("../helpers/config.js");

const {
  resolveDemoBase,
  checkDefaultBasePath,
  getBasePath,
  getFullPath,
  chooseFolder,
  setBasePath,
  handleReadFile,
  handleReadPublicFile,
  handleOpenFile,
  handleOpenFolder,
  handleSavePublicFile,
  handleListDirectory,
  deleteItem,
  moveItem,
  createFolder,
  selectFiles,
  copyFile
} = require("../helpers/fileHelpers");

const IS_DEMO = appConfig.APP_MODE === "demo";

const handleFileHandlers = (ipcMain, store) => {

  ipcMain.handle('fs:listDirectory', (_, path) => {
    return handleListDirectory(store, path);
  });

  ipcMain.handle('fs:checkDefaultBasePath', () => {
    return checkDefaultBasePath();
  });

  // Get digital catalogue base path
  ipcMain.handle('fs:getBasePath', () => {
    if (IS_DEMO) {
      const demoBase = resolveDemoBase();
      return { exists: true, basePath: demoBase }
    }
    return getBasePath(store);
  });

  ipcMain.handle('fs:setBasePath', (event, newPath) => {
    setBasePath(store, newPath);
    event.sender.send("base-path-updated", newPath);
  });

  ipcMain.handle('fs:chooseFolder', (_, defaultPath) => {
    return chooseFolder(store, defaultPath);
  });

  ipcMain.handle('fs:getFullPath', (_, relativePath) => {
    return getFullPath(store, relativePath);
  });

  ipcMain.handle('fs:readFile', (_, filePath) => {
    return handleReadFile(filePath);
  });

  ipcMain.handle("fs:readPublicFile", (_, relPath) => {
    return handleReadPublicFile(relPath);
  });

  ipcMain.handle("fs:handleSavePublicFile", (_, srcRelative, saveAs) => {
    return handleSavePublicFile(srcRelative, saveAs);
  });

  ipcMain.handle('fs:openFile', (_, filePath) => {
    return handleOpenFile(filePath);
  });

  ipcMain.handle('fs:openFolder', (_, folderPath) => {
    return handleOpenFolder(folderPath);
  });

  // Digital Catalogue manipulation

  ipcMain.handle("fs:deleteItem", async (_, filePath) => {
    return deleteItem(filePath);
  });
  
  ipcMain.handle("fs:moveItem", async (_, src, dest) => {
    return moveItem(src, dest);
  });
  
  ipcMain.handle("fs:createFolder", async (event, { basePath, folderName }) => {
    return createFolder(basePath, folderName);
  });

  ipcMain.handle("fs:selectFiles", async (event, filters) => {
    return selectFiles(filters);
  });
  
  ipcMain.handle("fs:copyFile", async (event, filePath, targetDir) => {
    return copyFile(filePath, targetDir);
  });

};

module.exports = handleFileHandlers;