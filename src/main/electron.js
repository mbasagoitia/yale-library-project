// electron.js
const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const dotenv = require('dotenv');
const fs = require("fs");

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
    title: "Philharmonia Library Catalogue",
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    resizable: false,
    modal: true
  });

  if (isDev) {
    if (APP_MODE === "demo") {
      setupWindow.loadURL('http://localhost:3000/');
    } else if (APP_MODE === "internal") {
      setupWindow.loadURL('http://localhost:3000/setup');
    }

  } else {
    if (APP_MODE === "demo") {
      setupWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}#/`);
    } else if (APP_MODE === "internal") {
      setupWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}#/setup`);
    }
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

app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors,SiteIsolationTrial");
app.commandLine.appendSwitch("disable-gpu");

app.whenReady().then(() => {
  // remove later
  store.set("initialSetup", false);

  const DEV_HOST = process.env.HOST || 'localhost';
  const DEV_PORT = Number(process.env.PORT) || 3000;

  // Everything is HTTP in dev except CAS serviceUrl
  const DEV_UI = `http://${DEV_HOST}:${DEV_PORT}`;
  const DEV_WS = `ws://${DEV_HOST}:${DEV_PORT}`;
  const DEV_API = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

  const CSP = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self' ${DEV_UI} ${DEV_WS} ${DEV_API}`,
  ].join('; ');

  // Inject CSP but skip Yale CAS & Duo
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const url = details.url;
    if (
      url.startsWith("https://secure.its.yale.edu/cas") ||
      url.includes("duosecurity.com")
    ) {
      callback({ responseHeaders: details.responseHeaders });
    } else {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          "Content-Security-Policy": [CSP],
        },
      });
    }
  });

  // Register IPC handlers
  handleFileHandlers(ipcMain, store);
  handleAuthHandlers(ipcMain, store);
  handleBackupHandlers(ipcMain, store);
  handleSetupHandlers(ipcMain, store);

  // Open the appropriate window
  if (!store.get("initialSetup")) {
    createSetupWindow();
  } else {
    createMainWindow();
  }

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

// Setup completion from renderer
ipcMain.on("setup-complete", () => {
  store.set("initialSetup", true);

  if (setupWindow) {
    setupWindow.close();
    setupWindow = null;
  }

  createMainWindow();
});
