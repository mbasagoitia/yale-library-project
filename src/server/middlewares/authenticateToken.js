const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    const error = new Error('Missing Authorization header');
    error.status = 401;
    return next(error);
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    const error = new Error('Missing token');
    error.status = 401;
    return next(error);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      const error = new Error('Invalid or expired token');
      error.status = 403;
      return next(error);
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
