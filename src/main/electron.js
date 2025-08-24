const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();
const APP_MODE = process.env.APP_MODE || 'demo';

const handleFileHandlers = require("./ipcHandlers/fileHandlers.js");
const handleAuthHandlers = require("./ipcHandlers/authHandlers.js");
const handleBackupHandlers = require("./ipcHandlers/backupHandlers.js");
const handleSetupHandlers = require('./ipcHandlers/setupHandlers.js');
const { createWindow } = require("./helpers/createMainWindow.js");

const isDev = !app.isPackaged;
const Store = require('electron-store').default;

const store = new Store({
  defaults: {
    initialSetup: false,
    cataloguePath: null
  }
});

if (!isDev) {
  require('../server/startServer');
}

let mainWindow;
let setupWindow;

function createSetupWindow() {
  setupWindow = new BrowserWindow({
    title: "Setup Wizard",
    // 600
    width: 800,
    // 400
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    resizable: false,
    modal: true
  });

  if (isDev) {
    setupWindow.loadURL('https://yourapp.local:3000/setup');
  } else {
    setupWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}#/setup`);
  }

  setupWindow.on('closed', () => {
    setupWindow = null;
  });
}

function createMainWindow() {
  mainWindow = createWindow();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // eventually remove this
  store.set("initialSetup", false);
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

  // Check setup state
  if (!store.get("initialSetup")) {
    createSetupWindow();
  } else {
    createMainWindow();
  }

  handleFileHandlers(ipcMain, store, mainWindow);
  handleAuthHandlers(ipcMain, store, mainWindow);
  handleBackupHandlers(ipcMain, store, mainWindow);
  handleSetupHandlers(ipcMain, store);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      if (!store.get("initialSetup")) {
        createSetupWindow();
      } else {
        createMainWindow();
      }
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


ipcMain.on("setup-complete", () => {
  store.set("initialSetup", true);

  if (setupWindow) {
    setupWindow.close();
    setupWindow = null;
  }

  createMainWindow();
});
