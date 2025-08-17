const { app, BrowserWindow, ipcMain, session } = require('electron');
const dotenv = require('dotenv');

dotenv.config();
const APP_MODE = process.env.APP_MODE || 'demo';

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

  const DEV_HOST = process.env.HOST || 'localhost';
  const DEV_PORT = Number(process.env.PORT) || 3000;
  const DEV_HTTPS = String(process.env.HTTPS).toLowerCase() === 'true';

  const DEV_UI = `${DEV_HTTPS ? 'https' : 'http'}://${DEV_HOST}:${DEV_PORT}`;
  const DEV_WS = `${DEV_HTTPS ? 'wss' : 'ws'}://${DEV_HOST}:${DEV_PORT}`;

  const DEV_API = process.env.REACT_APP_API_BASE || 'https://localhost:5000';

  // Setting content security policy
  const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "script-src 'self' https://cdnjs.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' ${DEV_UI} ${DEV_WS} ${DEV_API}`,
  "frame-src 'none'",
  "worker-src 'self' blob: https://cdnjs.cloudflare.com",
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
