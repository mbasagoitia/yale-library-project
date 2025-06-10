const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  openAuthWindow: () => ipcRenderer.invoke("open-auth-window"),
  getFullPath: (basePath, relativePath) => ipcRenderer.invoke('get-full-path', basePath, relativePath),
  selectBasePath: () => ipcRenderer.invoke('select-base-path'),
  getBasePath: () => ipcRenderer.invoke('get-base-path'),
  readFolder: (path) => ipcRenderer.invoke("read-folder", path),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath)
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
