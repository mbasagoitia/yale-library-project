const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  openAuthWindow: () => ipcRenderer.invoke("open-auth-window"),
  getFullPath: (relativePath) => ipcRenderer.invoke('get-full-path', relativePath),
  selectBasePath: () => ipcRenderer.invoke('select-base-path')
});

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on: (channel, listener) => ipcRenderer.on(channel, listener),
    send: (channel, data) => ipcRenderer.send(channel, data),
  }
});
