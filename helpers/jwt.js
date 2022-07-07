const jwt = require('jsonwebtoken');

const SECRET_KEY = 'some-secret-key';
const EXPIRE_TOKEN = '7d';

const generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRE_TOKEN });
}

const checkToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
}

module.exports = {
  generateToken,
  checkToken,
}
