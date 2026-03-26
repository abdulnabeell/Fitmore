// src/middleware/auth.js
// Generic token verification middleware. Expects `req.tokenKey` to be set by the caller (e.g., adminAuth or userAuth).
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const tokenKey = req.tokenKey || 'token'; // fallback
  const token = req.cookies[tokenKey] || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // payload contains id, role, etc.
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}

module.exports = verifyToken;
