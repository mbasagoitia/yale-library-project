const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const xss = require('xss');
const { parseStringPromise } = require('xml2js');
const { httpsRequest, isNetIDAdmin } = require('../helpers/authHelpers.js');
const { appConfig } = require("../../main/helpers/config.js");

dotenv.config();

const JWT_SECRET = appConfig.JWT_SECRET;

const validateTicket = async (req, res, next) => {
  let { ticket } = req.query;

  if (!ticket) {
    const error = new Error('Missing CAS ticket');
    error.status = 400;
    return next(error);
  }

  ticket = xss(ticket);

  try {
    const serviceUrl = 'https://yourapp.local/verify';
    const validateURL = `https://secure.its.yale.edu/cas/serviceValidate?ticket=${encodeURIComponent(ticket)}&service=${encodeURIComponent(serviceUrl)}`;

    const responseBody = await httpsRequest(validateURL);
    const parsed = await parseStringPromise(responseBody);
    const success = parsed?.['cas:serviceResponse']?.['cas:authenticationSuccess'];

    if (!success) {
      const error = new Error('CAS authentication failed');
      error.status = 401;
      return next(error);
    }

    const netid = success[0]?.['cas:user']?.[0];
    
    const isAdmin = await isNetIDAdmin(req.db, netid);

    const token = jwt.sign({ netid, isAdmin }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      success: true,
      token,
      netid,
      isAdmin
    });

  } catch (err) {
    return next(err);
  }
};

const renewToken = (req, res, next) => {
  try {
    const { netid, isAdmin } = req.user;
    const newToken = jwt.sign({ netid, isAdmin }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ success: true, token: newToken, netid: netid, isAdmin: isAdmin });
  } catch (err) {
    const error = new Error('Failed to renew token');
    error.status = 500;
    return next(error);
  }
};

module.exports = {
  validateTicket,
  renewToken
};
