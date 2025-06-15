const { createAuthWindow } = require("../helpers/createAuthWindow");

const handleAuthHandlers = (ipcMain, mainWindow, store, pool) => {
  ipcMain.handle("open-auth-window", () => {
    createAuthWindow(mainWindow, store, pool);
  });

  ipcMain.handle("auth:getToken", () => {
    return store.get("authToken");
  });

  ipcMain.handle("auth:getNetID", () => {
    return store.get("netid");
  });

  ipcMain.handle("auth:getIsAdmin", () => {
    return store.get("isAdmin");
  });
};

module.exports = handleAuthHandlers;
