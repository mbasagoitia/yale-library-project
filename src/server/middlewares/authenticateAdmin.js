const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    const err = new Error('Authentication required: No token provided');
    err.status = 401;
    return next(err); 
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.isAdmin) {
      const err = new Error('Forbidden: You do not have admin rights');
      err.status = 403;
      return next(err);
    }

    req.user = decoded;
    next();
  } catch (err) {
    err.status = 401;
    return next(err); 
  }
};


module.exports = {
    authenticateAdmin
}