const path = require('path');
const { BrowserWindow } = require('electron');

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const url = isDev
    ? 'https://yourapp.local:3000'
    : `file://${path.join(__dirname, 'build', 'index.html')}`;

  mainWindow.loadURL(url);

  return mainWindow;
};

module.exports = {
  createWindow,
};
