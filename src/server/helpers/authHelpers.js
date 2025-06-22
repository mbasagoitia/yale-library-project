const https = require('https');

const httpsRequest = (url) => {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => (data += chunk));
        res.on('end', () => resolve(data));
      }).on('error', (err) => reject(err));
    });
  };

const isNetIDAdmin = async (db, netid) => {
    const [rows] = await db.query('SELECT * FROM admins WHERE netid = ?', [netid]);
    return rows.length > 0;
};

module.exports = {
    httpsRequest,
    isNetIDAdmin
}