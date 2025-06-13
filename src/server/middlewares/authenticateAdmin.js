import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.isAdmin) return res.status(403).json({ error: 'Forbidden: Not an admin' });

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}


export {
    authenticateAdmin
}