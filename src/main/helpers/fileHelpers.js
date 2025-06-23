const { dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs-extra');

const getBasePath = (store) => {
    const basePath = store.get('basePath');
    if (!basePath) {
        throw new Error("Base path is not set. Please select a Digital Catalogue root folder.");
    }
    return basePath;
};

const setBasePath = async (store, window) => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    });
  
    if (!result.canceled && result.filePaths.length > 0) {
      const selectedPath = result.filePaths[0];
      store.set("basePath", selectedPath);
      window.webContents.send("base-path-updated", selectedPath);
    
      return selectedPath;
  }
  
    return null;
  };

const handleReadFile = async (filePath) => {
    const data = await fs.promises.readFile(filePath);
    return data.buffer;
};

const handleOpenFile = async (fullPath) => {
    try {
        const result = await shell.openPath(fullPath);
        if (result) {
            console.error('Failed to open file:', result);
            return { success: false, error: result };
        }
        return { success: true };
    } catch (err) {
        console.error('Error opening file:', err);
        return { success: false, error: err.message };
    }
};

const handleOpenFolder = async (folderPath) => {
    try {
        const result = await shell.openPath(folderPath);
        if (result) {
            console.error('Failed to open folder:', result);
            return { success: false, error: result };
        }
        return { success: true };
    } catch (err) {
        console.error('Error opening folder:', err);
        return { success: false, error: err.message };
    }
};

const handleListDirectory = async (store, relativePath = '') => {
    const basePath = getBasePath(store);
    const targetPath = path.join(basePath, relativePath);

    const entries = await fs.promises.readdir(targetPath, { withFileTypes: true });

    return entries.map((entry) => ({
        name: entry.name,
        isDirectory: entry.isDirectory(),
        relativePath: path.join(relativePath, entry.name)
    }));
};

module.exports = {
    getBasePath,
    setBasePath,
    handleReadFile,
    handleOpenFile,
    handleOpenFolder,
    handleListDirectory
};
