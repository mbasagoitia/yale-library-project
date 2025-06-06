const { app, BrowserWindow, ipcMain } = require('electron');
const https = require('https');
const { parseStringPromise } = require('xml2js');
const path = require('path');
const mysql = require('mysql2/promise');
const isDev = !app.isPackaged;
const dotenv = require("dotenv");

dotenv.config();

if (!isDev) {
  require('./src/server/startServer');
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_DATABASE
});

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const url = isDev
    ? 'https://yourapp.local:3000'
    : `file://${path.join(__dirname, 'build', 'index.html')}`;

  mainWindow.loadURL(url);
}

function createAuthWindow() {
  const authWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: true,
    parent: BrowserWindow.getFocusedWindow(),
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
      validateTicket(ticket);
      event.preventDefault();
      authWindow.close();
    }
  });
  
}

function validateTicket(ticket) {
  const serviceUrl = 'https://yourapp.local/verify';
  const validateURL = `https://secure.its.yale.edu/cas/serviceValidate?ticket=${ticket}&service=${encodeURIComponent(serviceUrl)}`;

  https.get(validateURL, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', async () => {
      try {
        const parsed = await parseStringPromise(data);
        const success = parsed['cas:serviceResponse']['cas:authenticationSuccess'];
        if (success) {
          const netid = success[0]['cas:user'][0];
          if (success) {
            const netid = success[0]['cas:user'][0];
            const isAdmin = await isNetIDAdmin(netid);
            
            if (isAdmin) {
              console.log(`${netid} is an admin`);
              mainWindow.webContents.send('auth-success', { netid, isAdmin: true });
            } else {
              // console.log(`${netid} is NOT an admin`);
              mainWindow.webContents.send('auth-success', { netid, isAdmin: false });
            }
          }

        } else {
          console.error("Ticket validation failed", data);
        }
      } catch (err) {
        console.error("Failed to parse CAS XML", err);
      }
    });
  }).on('error', (err) => {
    console.error("Error contacting CAS", err);
  });
}

async function isNetIDAdmin(netid) {
  const [rows] = await pool.query('SELECT * FROM admins WHERE netid = ?', [netid]);
  return rows.length > 0;
}


ipcMain.handle("open-auth-window", () => {
  createAuthWindow();
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
