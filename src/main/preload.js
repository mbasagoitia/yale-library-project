const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  auth: {
    getToken: () => ipcRenderer.invoke("auth:getToken"),
    getNetID: () => ipcRenderer.invoke("auth:getNetID"),
    getIsAdmin: () => ipcRenderer.invoke("auth:getIsAdmin"),
    clear: () => ipcRenderer.invoke("auth:clear"),
    openLoginWindow: () => ipcRenderer.invoke("auth:openWindow"),
  },

  backup: {
    createReadable: () => ipcRenderer.invoke("backup:createReadable"),
    createMySQL: () => ipcRenderer.invoke("backup:createMySQL"),
    zipCatalogue: () => ipcRenderer.invoke("backup:zipCatalogue"),
  },

  filesystem: {
    getFullPath: (basePath, relativePath) =>
      ipcRenderer.invoke("fs:getFullPath", basePath, relativePath),
    selectBasePath: () => ipcRenderer.invoke("fs:selectBasePath"),
    getBasePath: () => ipcRenderer.invoke("fs:getBasePath"),
    readFolder: (path) => ipcRenderer.invoke("fs:readFolder", path),
    readFile: (filePath) => ipcRenderer.invoke("fs:readFile", filePath),
    openFile: (fullPath) => ipcRenderer.invoke("fs:openFile", fullPath),
    openFolder: (folderPath) => ipcRenderer.invoke("fs:openFolder", folderPath),
  },

  digitalCatalogue: {
    listDirectory: (relativePath) =>
      ipcRenderer.invoke("catalogue:listDirectory", relativePath),
    getAllFolders: (basePath) =>
      ipcRenderer.invoke("catalogue:getAllFolders", basePath),
  },

  events: {
    on: (channel, callback) => {
      const validChannels = ["basePath-updated"];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, callback);
      }
    },
    remove: (channel, callback) => {
      ipcRenderer.removeListener(channel, callback);
    },
  },
});
