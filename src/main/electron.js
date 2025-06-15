const { app, BrowserWindow, ipcMain } = require('electron');
const mysql = require('mysql2/promise');
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

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_DATABASE
});

let mainWindow;

app.whenReady().then(() => {
  mainWindow = createWindow();

  handleFileHandlers(ipcMain, store, mainWindow);
  handleAuthHandlers(ipcMain, mainWindow, store, pool);
  handleBackupHandlers(ipcMain, store, pool);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
