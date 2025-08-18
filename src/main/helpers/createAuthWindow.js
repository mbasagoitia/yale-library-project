const { BrowserWindow } = require('electron');

let authWin = null;

const createAuthWindow = (mainWindow, store) => {
  if (authWin) { authWin.focus(); return; }
  let loginCompleted = false;
  
  authWin = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
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
    },
  });

  const serviceUrl = 'https://yourapp.local/verify';
  const casLoginUrl = `https://secure.its.yale.edu/cas/login?service=${encodeURIComponent(serviceUrl)}`;

  authWin.loadURL(casLoginUrl);

  authWin.once('ready-to-show', () => authWin?.show());

  authWin.on('closed', () => {
    const cancelled = !loginCompleted;
    authWin = null;
    if (cancelled) {
      mainWindow.webContents.send('auth-failed', { reason: 'Cancelled login' });
    }
  });

  authWin.webContents.on('before-input-event', (e, input) => {
    const isCmdOrCtrl = input.meta || input.control;
    if (input.type === 'keyDown' && (
      input.key === 'Escape' || (isCmdOrCtrl && input.key.toLowerCase() === 'w')
    )) {
      e.preventDefault();
      authWin?.close();
    }
  });

  authWin.webContents.on('will-redirect', (event, url) => {
    const ticketMatch = url.match(/[?&]ticket=([^&]+)/);
    if (ticketMatch) {
      const ticket = ticketMatch[1];
      event.preventDefault();
      authWin.close();

      fetch(`https://localhost:5000/api/auth/validate-ticket?ticket=${encodeURIComponent(ticket)}`)
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
            mainWindow.webContents.send('auth-failed', { reason: 'Invalid credentials' });
          }
        })
        .catch(err => {
          mainWindow.webContents.send('auth-failed', {
            reason: 'An error occurred while validating your login. Please try again.'
          });
        });        
    }
  });
};

const closeAuthWindow = () => {
  if (authWin && !authWin.isDestroyed()) authWin.close();
};

module.exports = {
  createAuthWindow,
  closeAuthWindow
};
