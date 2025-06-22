const jwt = require('jsonwebtoken');
const { parseStringPromise } = require('xml2js');
const { httpsRequest, isNetIDAdmin } = require('../helpers/authHelpers.js');

const JWT_SECRET = process.env.JWT_SECRET;

const validateTicket = async (req, res) => {
  const { ticket } = req.query;

  if (!ticket) {
    return res.status(400).json({ error: 'Missing CAS ticket' });
  }

  try {
    const serviceUrl = 'https://yourapp.local/verify';
    const validateURL = `https://secure.its.yale.edu/cas/serviceValidate?ticket=${encodeURIComponent(ticket)}&service=${encodeURIComponent(serviceUrl)}`;

    const responseBody = await httpsRequest(validateURL);
    const parsed = await parseStringPromise(responseBody);
    const success = parsed?.['cas:serviceResponse']?.['cas:authenticationSuccess'];

    if (!success) {
      return res.status(401).json({ error: 'CAS authentication failed' });
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
    console.error("Ticket validation failed:", err);
    res.status(500).json({ error: 'Ticket validation failed' });
  }
};

module.exports = {
  validateTicket
};
