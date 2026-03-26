// src/middleware/adminAuth.js
// Admin‑specific wrapper that sets the expected cookie key and delegates to generic verifier.
const verifyToken = require('./auth');

function adminAuth(req, res, next) {
  // Tell generic verifier which cookie to look for
  req.tokenKey = 'adminToken';
  verifyToken(req, res, next);
}

module.exports = adminAuth;
