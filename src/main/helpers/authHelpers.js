const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');
const https = require('https');
const { parseStringPromise } = require('xml2js');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const isNetIDAdmin = async (pool, netid) => {
  const [rows] = await pool.query('SELECT * FROM admins WHERE netid = ?', [netid]);
  return rows.length > 0;
};

const httpsRequest = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => resolve(data));
    }).on('error', (err) => reject(err));
  });
};

const validateTicket = async (mainWindow, store, ticket, pool) => {
  try {
    const serviceUrl = 'https://yourapp.local/verify';
    const validateURL = `https://secure.its.yale.edu/cas/serviceValidate?ticket=${encodeURIComponent(ticket)}&service=${encodeURIComponent(serviceUrl)}`;
    
    const responseBody = await httpsRequest(validateURL);
    const parsed = await parseStringPromise(responseBody);
    const success = parsed?.['cas:serviceResponse']?.['cas:authenticationSuccess'];

    if (!success) {
      console.error("CAS authentication failed", responseBody);
      return;
    }

    const netid = success[0]?.['cas:user']?.[0];
    const isAdmin = await isNetIDAdmin(pool, netid);

    const token = jwt.sign({ netid, isAdmin }, JWT_SECRET, { expiresIn: '1h' });

    store.set('authToken', token);
    store.set('netid', netid);
    store.set('isAdmin', isAdmin);

    mainWindow.webContents.send('auth-success', {
      token,
      netid,
      isAdmin
    });

  } catch (err) {
    console.error("Error validating CAS ticket:", err);
  }
};

module.exports = {
  validateTicket,
  isNetIDAdmin
};
