const { checkToken } = require('../helpers/jwt');
const RequestDataError = require('../errors/RequestDataError');

const auth = (req, res, next) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    throw new RequestDataError('передан неверный логин или пароль');
  }
  const token = authToken.replace('Bearer ', '');
  try {
    req.user = checkToken(token);
    // console.log('req.user: ', req.user)
  } catch (err) {
    console.log('authError: ')
    throw new RequestDataError('передан неверный логин или пароль');

  }

  next();
}

module.exports = { auth };