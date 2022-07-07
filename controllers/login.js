const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ExistItemError = require('../errors/ExistItemError');
const RequestDataError = require('../errors/RequestDataError');

module.exports.login = (req ,res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject( new ExistItemError('передан неверный логин или пароль.'))
      }
      return bcrypt.compare(password, user.password)
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject( new RequestDataError('передан неверный логин или пароль.'))
      }
      const token = jwt.sign({_id: user._id }, 'some-secret-key', { expiresIn: '7d' })
      res.send('all right!')
    })
    .catch(err => next(err))

}
