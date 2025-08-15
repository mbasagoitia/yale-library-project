const app = require('./server');
const https = require('https');
const fs = require('fs-extra');
const path = require('path');

const port = process.env.PORT || 5000;

const key = fs.readFileSync(path.join(__dirname, '../../certs/localhost+2-key.pem'));
const cert = fs.readFileSync(path.join(__dirname, '../../certs/localhost+2.pem'));

https.createServer({ key, cert }, app).listen(port, () => {
  console.log('API on https://localhost:5000');
});