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
    zipCatalogue: () => ipcRenderer.invoke("backup:zipCatalogue")
  },

  filesystem: {
    getFullPath: (basePath, relativePath) =>
      ipcRenderer.invoke("fs:getFullPath", basePath, relativePath),
    checkDefaultBasePath: () => ipcRenderer.invoke("fs:checkDefaultBasePath"),
    chooseFolder: (defaultPath) => ipcRenderer.invoke("fs:chooseFolder", defaultPath),
    setBasePath: (newPath) => ipcRenderer.invoke("fs:setBasePath", newPath),
    getBasePath: () => ipcRenderer.invoke("fs:getBasePath"),
    readFile: (filePath) => ipcRenderer.invoke("fs:readFile", filePath),
    openFile: (fullPath) => ipcRenderer.invoke("fs:openFile", fullPath),
    listDirectory: (relativePath) => ipcRenderer.invoke("fs:listDirectory", relativePath),
    openFolder: (folderPath) => ipcRenderer.invoke("fs:openFolder", folderPath),
    deleteItem: (path) => ipcRenderer.invoke("fs:deleteItem", path),
    moveItem: (src, dest) => ipcRenderer.invoke("fs:moveItem", src, dest),
    createFolder: (parent, name) => ipcRenderer.invoke("fs:createFolder", parent, name),
    selectFolder: (defaultPath) => ipcRenderer.invoke("fs:selectFolder", defaultPath),
  },

  setup: {
    getInitialSetup: () => ipcRenderer.invoke("setup:getInitialSetup"),
    setupComplete: () => ipcRenderer.send("setup-complete")
  },

  events: {
    on: (channel, callback) => {
      const validChannels = ["auth-success", "auth-failed", "setup-complete"];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, callback);
      }
    },
    remove: (channel, callback) => {
      ipcRenderer.removeListener(channel, callback);
    },
  },
});
