const bcrypt = require('bcryptjs');
const User = require('../models/user');
const RequestDataError = require('../errors/RequestDataError');
const { generateToken } = require('../helpers/jwt');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new RequestDataError('передан неверный логин или пароль.'));
      }
      return Promise.all([
        user,
        bcrypt.compare(password, user.password),
      ]);
    })
    .then(([user, matched]) => {
      if (!matched) {
        return Promise.reject(new RequestDataError('передан неверный логин или пароль.'));
      }
      return generateToken({ _id: user._id });
    })
    .then((token) => {
      res.send({ token });
    })
    .catch((err) => next(err));
};
