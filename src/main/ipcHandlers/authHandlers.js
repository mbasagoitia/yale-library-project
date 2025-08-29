const { BrowserWindow } = require("electron");
const { createAuthWindow, closeAuthWindow } = require("../helpers/createAuthWindow.js");
const { renewToken } = require("../helpers/authHelpers.js");

const handleAuthHandlers = (ipcMain, store) => {

  ipcMain.handle("auth:open", (event) => {
    const requestWin = BrowserWindow.fromWebContents(event.sender);

    // Hardcode CAS + service for now
    createAuthWindow(requestWin, store, {
      casLoginUrl: "https://secure.its.yale.edu/cas/login",
      serviceUrl: "https://yourapp.local/verify",
      backendVerifyUrl: "http://localhost:5000/api/auth/validate-ticket"
    });

    // Don’t return a BrowserWindow — just signal success
    return true;
  });


  ipcMain.handle("auth:cancel", () => {
    return closeAuthWindow();
  });

  ipcMain.handle("auth:getToken", () => store.get("authToken") || null);
  ipcMain.handle("auth:getNetID", () => store.get("netid") || null);
  ipcMain.handle("auth:getIsAdmin", () => store.get("isAdmin") || false);

  ipcMain.handle("auth:renewToken", async () => {
    return await renewToken(store);
  });

  ipcMain.handle("auth:clear", () => {
    store.delete("authToken");
    store.delete("netid");
    store.delete("isAdmin");
  });
};

module.exports = handleAuthHandlers;
