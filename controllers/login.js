const User = require('../models/user');
const bcrypt = require('bcryptjs');
const ExistItemError = require('../errors/ExistItemError');
const RequestDataError = require('../errors/RequestDataError');
const { generateToken } = require('../helpers/jwt');

module.exports.login = (req ,res, next) => {
  const { email, password } = req.body;
  if(!email || !password) {
    throw new RequestDataError('передан неверный логин или пароль 1.')
  }
  User.findOne({ email }).select('+password')
    .then((user) => {
      console.log('loginUser: ',user)
      if (!user) {
        return Promise.reject( new ExistItemError('передан неверный логин или пароль 2.'))
      }
      return Promise.all([
        user,
        bcrypt.compare(password, user.password)
      ])
    })
    .then(([user, matched]) => {
      if (!matched) {
        return Promise.reject( new RequestDataError('передан неверный логин или пароль 3.'))
      }
      return generateToken({_id: user._id });
    })
    .then((token) => {
      res.send({ token })
    })
    .catch(err => next(err))

}
