const path = require('path');
const { BrowserWindow, app } = require('electron');

const isDev = !app.isPackaged;

const bool = v => (typeof v === 'string' ? v.toLowerCase() === 'true' : !!v);

function createWindow() {
  const mainWindow = new BrowserWindow({
    title: "Philharmonia Library Catalogue",
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    const startURLFromEnv = process.env.ELECTRON_START_URL;

    const HOST = process.env.HOST || 'localhost';
    const PORT = process.env.PORT || '3000';
    const HTTPS = bool(process.env.HTTPS);
    const defaultDevURL = `${HTTPS ? 'https' : 'http'}://${HOST}:${PORT}`;

    const devURL = startURLFromEnv || defaultDevURL;
    mainWindow.loadURL(devURL);
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
  }

  return mainWindow;
}

module.exports = { createWindow };
