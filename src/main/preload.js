const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  auth: {
    getToken: () => ipcRenderer.invoke("auth:getToken"),
    renewToken: () => ipcRenderer.invoke('auth:renewToken'),
    getNetID: () => ipcRenderer.invoke("auth:getNetID"),
    getIsAdmin: () => ipcRenderer.invoke("auth:getIsAdmin"),
    clear: () => ipcRenderer.invoke("auth:clear"),
    openLoginWindow: () => ipcRenderer.invoke('auth:open'),
    cancelLogin:     () => ipcRenderer.invoke('auth:cancel'),
  },

  backup: {
    createReadable: () => ipcRenderer.invoke("backup:createReadable"),
    createMySQL: () => ipcRenderer.invoke("backup:createMySQL"),
    zipCatalogue: () => ipcRenderer.invoke("backup:zipCatalogue"),
  },

  filesystem: {
    getFullPath: (basePath, relativePath) =>
      ipcRenderer.invoke("fs:getFullPath", basePath, relativePath),
    setBasePath: () => ipcRenderer.invoke("fs:setBasePath"),
    getBasePath: () => ipcRenderer.invoke("fs:getBasePath"),
    readFile: (filePath) => ipcRenderer.invoke("fs:readFile", filePath),
    openFile: (fullPath) => ipcRenderer.invoke("fs:openFile", fullPath),
    openFolder: (folderPath) => ipcRenderer.invoke("fs:openFolder", folderPath),
  },

  digitalCatalogue: {
    listDirectory: (relativePath) =>
      ipcRenderer.invoke("catalogue:listDirectory", relativePath)
  },

  events: {
    on: (channel, callback) => {
      const validChannels = ["base-path-updated", "auth-success", "auth-failed"];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, callback);
      }
    },
    remove: (channel, callback) => {
      ipcRenderer.removeListener(channel, callback);
    },
  },
});
