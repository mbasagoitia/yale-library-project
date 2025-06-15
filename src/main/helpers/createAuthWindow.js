const { BrowserWindow } = require('electron');
const { validateTicket } = require('./authHelpers');

const createAuthWindow = (mainWindow, store, pool) => {
  const authWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: true,
    parent: BrowserWindow.getFocusedWindow() || mainWindow,
    modal: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const serviceUrl = 'https://yourapp.local/verify';
  const casLoginUrl = `https://secure.its.yale.edu/cas/login?service=${encodeURIComponent(serviceUrl)}`;

  authWindow.loadURL(casLoginUrl);

  authWindow.webContents.on('will-redirect', (event, url) => {
    const ticketMatch = url.match(/[?&]ticket=([^&]+)/);
    if (ticketMatch) {
      const ticket = ticketMatch[1];
      event.preventDefault();
      authWindow.close();
      
      validateTicket(mainWindow, store, ticket, pool);
    }
  });
};

module.exports = {
  createAuthWindow,
};
