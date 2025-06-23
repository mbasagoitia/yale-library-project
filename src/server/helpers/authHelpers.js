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

  const isNetIDAdmin = (db, netid, callback) => {
    db.query('SELECT * FROM admins WHERE netid = ?', [netid], (err, results) => {
      if (err) return callback(err);
      const isAdmin = results.length > 0;
      callback(null, isAdmin);
    });
  };
  

module.exports = {
    httpsRequest,
    isNetIDAdmin
}