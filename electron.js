const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const Store = require('electron-store').default;
const { getBasePath, setBasePath } = require('./src/settings');
const https = require('https');
const { parseStringPromise } = require('xml2js');
const path = require('path');
const fs = require('fs-extra');
const { parse } = require('json2csv');
const archiver = require('archiver');
const mysqldump = require('mysqldump');
const mysql = require('mysql2/promise');
const isDev = !app.isPackaged;
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');

dotenv.config();

const store = new Store();

const JWT_SECRET = process.env.JWT_SECRET

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
      nodeIntegration: false
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
          const isAdmin = await isNetIDAdmin(netid);

          const token = jwt.sign({ netid, isAdmin }, JWT_SECRET, { expiresIn: '1h' });

          store.set('authToken', token);
          store.set('netid', netid);
          store.set('isAdmin', isAdmin);

          mainWindow.webContents.send('auth-success', {
            token,
            netid,
            isAdmin
          });
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

ipcMain.handle('auth:getToken', () => {
  return store.get('authToken');
});

ipcMain.handle('auth:getNetID', () => {
  return store.get('netid');
});

ipcMain.handle('auth:getIsAdmin', () => {
  return store.get('isAdmin');
});


ipcMain.handle('get-full-path', (event, basePath, relativePath) => {
  return path.join(basePath, relativePath);
});

ipcMain.handle('get-base-path', async () => {
  return getBasePath();
});

ipcMain.handle('select-base-path', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });

  if (!result.canceled && result.filePaths.length > 0) {
    setBasePath(result.filePaths[0]);
    return result.filePaths[0];
  }

  return null;
});

ipcMain.handle('read-file', (event, filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        reject(err);
      } else {
        resolve(data.buffer);
      }
    });
  });
});

ipcMain.handle('open-file', async (event, fullPath) => {
  try {
    const result = await shell.openPath(fullPath);
    if (result) {
      console.error('Failed to open file:', result);
      return { success: false, error: result };
    }
    return { success: true };
  } catch (err) {
    console.error('Error opening file:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('open-folder', async (event, folderPath) => {
  try {
    const result = await shell.openPath(folderPath);
    if (result) {
      console.error('Failed to open folder:', result);
      return { success: false, error: result };
    }
    return { success: true };
  } catch (err) {
    console.error('Error opening folder:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('digitalCatalogue:listDirectory', async (event, relativePath = '') => {
  const basePath = getBasePath();
  const targetPath = path.join(basePath, relativePath);

  const entries = await fs.promises.readdir(targetPath, { withFileTypes: true });

  return entries.map((entry) => ({
    name: entry.name,
    isDirectory: entry.isDirectory(),
    relativePath: path.join(relativePath, entry.name)
  }));
});

ipcMain.handle('read-folder', async (event, dirPath) => {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  return entries.map(entry => ({
    name: entry.name,
    isDirectory: entry.isDirectory(),
    fullPath: path.join(dirPath, entry.name),
  }));
});


const exportReadableBackup = async (mainWindow) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.title AS Title, c.last_name AS composer_lastname, c.first_name AS composer_firstname, pub.label AS publisher, p.additional_notes AS additional_notes, con.label AS condition_description, p.call_number, p.acquisition_date
      FROM pieces p INNER JOIN composers c ON p.composer_id = c.id 
      INNER JOIN publisher_options pub ON p.publisher_id = pub.id
      INNER JOIN conditions con ON p.condition_id = con.id
      ORDER BY c.last_name ASC, p.title ASC;`);

    const csv = parse(rows);

    const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
      title: 'Save Spreadsheet-Friendly Backup',
      defaultPath: `holdings_backup_${new Date().toISOString().split('T')[0]}.csv`,
      filters: [{ name: 'CSV Files', extensions: ['csv'] }]
    });

    if (canceled || !filePath) return { success: false, message: 'Backup cancelled' };

    fs.writeFileSync(filePath, csv, 'utf-8');
    return { success: true, message: `Backup saved to ${filePath}` };

  } catch (error) {
    console.error('CSV export failed:', error);
    return { success: false, message: 'Failed to export CSV backup.' };
  }
};

const exportMySQLDump = async (mainWindow) => {
  try {
    const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
      title: 'Save Full MySQL Backup',
      defaultPath: `full_db_backup_${new Date().toISOString().split('T')[0]}.sql`,
      filters: [{ name: 'SQL Files', extensions: ['sql'] }]
    });

    if (canceled || !filePath) return { success: false, message: 'Backup cancelled' };

    await mysqldump({
      connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_DATABASE
      },
      dumpToFile: filePath,
    });

    return { success: true, message: `Full database backup saved to ${filePath}` };
  } catch (error) {
    console.error('MySQL dump failed:', error);
    return { success: false, message: 'Failed to export full database backup.' };
  }
};

function zipFolder(sourceFolderPath, outputZipPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputZipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    output.on('close', () => resolve(outputZipPath));
    archive.on('error', (err) => reject(err));

    archive.pipe(output);
    archive.directory(sourceFolderPath, false);
    archive.finalize();
  });
}

ipcMain.handle('backup:zipCatalogueFolder', async () => {
  const baseFolder = store.get("basePath");
  if (!baseFolder) throw new Error("No base path set.");

  const backupFolder = path.join(baseFolder, '..', 'backups');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const zipPath = path.join(backupFolder, `digital_catalogue_backup_${timestamp}.zip`);

  await fs.ensureDir(backupFolder);
  await zipFolder(baseFolder, zipPath);

  return zipPath;
});

ipcMain.handle('backup:readable', async () => {
  const window = BrowserWindow.getFocusedWindow();
  return await exportReadableBackup(window);
});

ipcMain.handle('backup:mysqldump', async () => {
  const window = BrowserWindow.getFocusedWindow();
  return await exportMySQLDump(window);
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
