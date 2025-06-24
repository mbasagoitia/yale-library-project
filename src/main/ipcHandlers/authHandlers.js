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

  ipcMain.handle("auth:clear", () => {
    store.clear();
    return Promise.resolve();
  });
};

module.exports = handleAuthHandlers;

