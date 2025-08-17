const APP_MODE = process.env.APP_MODE || 'demo';

const { app, BrowserWindow, ipcMain, session } = require('electron');
const dotenv = require('dotenv');

dotenv.config();

const handleFileHandlers = require("./ipcHandlers/fileHandlers.js");
const handleAuthHandlers = require("./ipcHandlers/authHandlers.js");
const handleBackupHandlers = require("./ipcHandlers/backupHandlers.js");
const { createWindow } = require("./helpers/createMainWindow.js");

const isDev = !app.isPackaged;
const Store = require('electron-store').default;

const store = new Store();

if (!isDev) {
  require('../server/startServer');
}

let mainWindow;

app.whenReady().then(() => {
  // Setting content security policy
  const DEV_UI = 'https://yourapp.local:3000';
  const DEV_API = 'https://localhost:5000'; 

  const CSP = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self' ${DEV_UI} wss://yourapp.local:3000 ${DEV_API}`,
    "frame-src 'none'",
    "worker-src 'self' blob:",                      
  ].join('; ');

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [CSP],
      },
    });
  });

  mainWindow = createWindow();

  handleFileHandlers(ipcMain, store, mainWindow);
  handleAuthHandlers(ipcMain, store, mainWindow);
  handleBackupHandlers(ipcMain, store, mainWindow);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
