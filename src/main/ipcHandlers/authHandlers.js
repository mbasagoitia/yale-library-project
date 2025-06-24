const { createAuthWindow } = require("../helpers/createAuthWindow");

const handleAuthHandlers = (ipcMain, store, mainWindow) => {
  ipcMain.handle("auth:openWindow", () => {
    return createAuthWindow(mainWindow, store);
  });

  ipcMain.handle("auth:getToken", () => {
    return Promise.resolve(store.get("authToken"));
  });

  ipcMain.handle("auth:getNetID", () => {
    return Promise.resolve(store.get("netid"));
  });

  ipcMain.handle("auth:getIsAdmin", () => {
    return Promise.resolve(store.get("isAdmin"));
  });

  ipcMain.handle('auth:renewToken', async () => {
    return await renewToken(store);
  });

  ipcMain.handle("auth:clear", () => {
    store.delete('authToken');
    store.delete('netid');
    store.delete('isAdmin');
    return Promise.resolve();
  });
};

module.exports = handleAuthHandlers;

