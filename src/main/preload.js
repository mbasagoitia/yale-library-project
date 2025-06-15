const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('auth', {
  getToken: () => ipcRenderer.invoke('auth:getToken'),
  getNetID: () => ipcRenderer.invoke('auth:getNetID'),
  getIsAdmin: () => ipcRenderer.invoke('auth:getIsAdmin'),
});

contextBridge.exposeInMainWorld('backupAPI', {
  createReadableBackup: () => ipcRenderer.invoke('backup:readable'),
  createMySQLBackup: () => ipcRenderer.invoke('backup:mysqldump'),
  zipCatalogueFolder: () => ipcRenderer.invoke('backup:zipCatalogueFolder')
});

contextBridge.exposeInMainWorld("electronAPI", {
  openAuthWindow: () => ipcRenderer.invoke("open-auth-window"),
  getFullPath: (basePath, relativePath) => ipcRenderer.invoke('get-full-path', basePath, relativePath),
  selectBasePath: () => ipcRenderer.invoke('select-base-path'),
  getBasePath: () => ipcRenderer.invoke('get-base-path'),
  readFolder: (path) => ipcRenderer.invoke("read-folder", path),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  openFile: (fullPath) =>
    ipcRenderer.invoke('open-file', fullPath),
  openFolder: (folderPath) =>
    ipcRenderer.invoke('open-folder', folderPath),
});

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on: (channel, listener) => ipcRenderer.on(channel, listener),
    send: (channel, data) => ipcRenderer.send(channel, data),
  }
});

contextBridge.exposeInMainWorld('digitalCatalogueAPI', {
  listDirectory: (relativePath) =>
    ipcRenderer.invoke('digitalCatalogue:listDirectory', relativePath),
});
