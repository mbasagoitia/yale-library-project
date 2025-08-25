const { dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const os = require("os");

const checkDefaultBasePath = async () => {
  const getDocumentsPath = () => {
    const homeDir = os.homedir();
    // Documents folder path
      const documentsPath = path.join(homeDir, 'Documents');
      if (fs.existsSync(documentsPath)) {
        return documentsPath;
      } 
      // Fallback 
      return homeDir;
  }

  const documentsPath = getDocumentsPath();
  // By design (and as instructed in the user manual), the user should have placed the digital catalogue
  // at this location and named it as such. If not, no problem--they can point it to the actual location/name later
  const defaultPath = path.join(documentsPath, "philharmonia_library_digital_catalogue");

  if (fs.existsSync(defaultPath)) {
    return { exists: true, path: defaultPath };
  } else {
    return { exists: false, path: defaultPath };
  }

  }


const getBasePath = (store) => {
  const basePath = store.get('basePath') || null;

  if (!basePath) {
    return { exists: false, basePath: null };
  }
  // Verifies that the basePath actually exists on the computer and matches what is stored in electron 
  const exists = fs.existsSync(path.resolve(basePath));

  return { exists, basePath };
};

const setBasePath = async (store, newPath) => {
    const normalizedPath = newPath.replace(/\\/g, '/');
    store.set("basePath", normalizedPath);
  
    return null;
}


// Generic get path of chosen folder
const chooseFolder = async (store, defaultPath) => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      defaultPath: defaultPath
    });
  
    if (!result.canceled && result.filePaths.length > 0) {
        const selectedPath = result.filePaths[0];
        const normalizedPath = selectedPath.replace(/\\/g, '/');
    
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

const handleListDirectory = async (store, filePath = '') => {

    const entries = await fs.promises.readdir(filePath, { withFileTypes: true });

    return entries.map((entry) => ({
        name: entry.name,
        isDirectory: entry.isDirectory(),
        relativePath: path.join(filePath, entry.name)
    }));
};

module.exports = {
    checkDefaultBasePath,
    getBasePath,
    chooseFolder,
    setBasePath,
    handleReadFile,
    handleOpenFile,
    handleOpenFolder,
    handleListDirectory
};