const path = require('path');
const { BrowserWindow, ipcMain } = require('electron');

let authWin = null;

function openAuthWindow(mainWindow) {
  if (authWin) { authWin.focus(); return; }

  authWin = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    parent: mainWindow,
    modal: false,
    resizable: true,
    minimizable: true,
    maximizable: false,
    closable: true,
    title: 'Yale CAS Login',
    autoHideMenuBar: true,
    frame: true,
    titleBarStyle: 'default',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // preload: path.join(__dirname, 'preload.js'), // if needed for messaging
    },
  });

  authWin.once('ready-to-show', () => authWin?.show());
  authWin.on('closed', () => {
    authWin = null;
    mainWindow.webContents.send('auth-failed', { reason: 'User cancelled login' });
  });

  // Allow ESC to close the window
  authWin.webContents.on('before-input-event', (e, input) => {
    if (input.type === 'keyDown' && input.key === 'Escape') {
      authWin?.close();
    }
  });

  const casLoginUrl = `https://secure.its.yale.edu/cas/login?service=${encodeURIComponent('https://yourapp.local/verify')}`;
  authWin.loadURL(casLoginUrl);
}

function closeAuthWindow() {
  if (authWin && !authWin.isDestroyed()) authWin.close();
}

ipcMain.handle('auth:open', (e) => openAuthWindow(BrowserWindow.fromWebContents(e.sender)));
ipcMain.handle('auth:cancel', () => closeAuthWindow());

module.exports = { openAuthWindow, closeAuthWindow };
