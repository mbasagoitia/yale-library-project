const { dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs-extra');

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

const getBasePath = (store) => {
    const basePath = store.get('basePath');
    return basePath || null;
};

const setFolderPath = async (store) => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      defaultPath: IS_DEMO ? resolveDemoBase() : getBasePath(store)
    });
  
    if (!result.canceled && result.filePaths.length > 0) {
        const selectedPath = result.filePaths[0];
        const normalizedPath = selectedPath.replace(/\\/g, '/');
    
      return normalizedPath;
  }
  
    return null;
};

const setBasePath = async (store, window) => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    });
  
    if (!result.canceled && result.filePaths.length > 0) {
      const selectedPath = result.filePaths[0];
      const normalizedPath = selectedPath.replace(/\\/g, '/');

      store.set("basePath", normalizedPath);
      window.webContents.send("base-path-updated", normalizedPath);
    
      return normalizedPath;
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
            return { success: false, error: result };
        }
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
};

const handleOpenFolder = async (folderPath) => {
    try {
        const result = await shell.openPath(folderPath);
        if (result) {
            return { success: false, error: result };
        }
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
};

const handleListDirectory = async (store, relativePath = '') => {
    const basePath = IS_DEMO ? resolveDemoBase() : getBasePath(store);
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
    setFolderPath,
    setBasePath,
    handleReadFile,
    handleOpenFile,
    handleOpenFolder,
    handleListDirectory
};
