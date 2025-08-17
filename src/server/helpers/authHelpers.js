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

  async function isNetIDAdmin(db, netid) {
    if (!netid) return false;
    const row = await db('admins').where({ netid }).first('id');
    return !!row;
  }
  module.exports = { isNetIDAdmin };
  

module.exports = {
    httpsRequest,
    isNetIDAdmin
}