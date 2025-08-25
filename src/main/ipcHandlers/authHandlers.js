const { BrowserWindow } = require("electron");
const { createAuthWindow, closeAuthWindow } = require("../helpers/createAuthWindow.js");
const { renewToken } = require("../helpers/authHelpers.js");

const handleAuthHandlers = (ipcMain, store) => {
  ipcMain.handle("auth:open", (event) => {
    const requestWin = BrowserWindow.fromWebContents(event.sender);
    return createAuthWindow(requestWin, store);
  });

  ipcMain.handle("auth:cancel", () => {
    return closeAuthWindow();
  });

  ipcMain.handle("auth:getToken", () => {
    return store.get("authToken") || null;
  });

  ipcMain.handle("auth:getNetID", () => {
    return store.get("netid") || null;
  });

  ipcMain.handle("auth:getIsAdmin", () => {
    return store.get("isAdmin") || false;
  });

  ipcMain.handle("auth:renewToken", async () => {
    return await renewToken(store);
  });

  ipcMain.handle("auth:clear", () => {
    store.delete("authToken");
    store.delete("netid");
    store.delete("isAdmin");
    return;
  });
};

module.exports = handleAuthHandlers;
