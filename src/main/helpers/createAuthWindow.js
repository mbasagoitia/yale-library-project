const { BrowserWindow } = require('electron');

const createAuthWindow = (mainWindow, store) => {
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

      fetch(`http://localhost:5000/api/auth/validate-ticket?ticket=${encodeURIComponent(ticket)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            store.set('authToken', data.token);
            store.set('netid', data.netid);
            store.set('isAdmin', data.isAdmin);
            mainWindow.webContents.send('auth-success', {
              token: data.token,
              netid: data.netid,
              isAdmin: data.isAdmin
            });
          } else {
            mainWindow.webContents.send('auth-failed');
          }
        })
        .catch(err => {
          console.error('Auth validation error:', err);
          mainWindow.webContents.send('auth-failed');
        });
    }
  });
};

module.exports = {
  createAuthWindow,
};
