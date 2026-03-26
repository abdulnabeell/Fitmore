// src/middleware/userAuth.js
// User‑specific wrapper that sets the expected cookie key and delegates to generic verifier.
const verifyToken = require('./auth');

function userAuth(req, res, next) {
  req.tokenKey = 'userToken';
  verifyToken(req, res, next);
}

module.exports = userAuth;
