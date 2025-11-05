// backend/src/utils/jwt.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET || 'change_me_secret';

function sign(payload, opts = {}) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d', ...opts });
}

function verify(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { sign, verify };
