const { createAuthWindow, closeAuthWindow } = require("../helpers/createAuthWindow.js");
const { renewToken } = require("../helpers/authHelpers.js")

const handleAuthHandlers = (ipcMain, store, mainWindow) => {
  ipcMain.handle("auth:open", () => {
    return createAuthWindow(mainWindow, store);
  });

  ipcMain.handle('auth:cancel', () => {
    return closeAuthWindow();
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

