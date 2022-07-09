const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
  ERROR_CREATE,
  ERROR_NOT_CORRECT,
  ERROR_DELETE,
  ERROR_NOT_FOUND,
  ERROR_EXIST,
  ERROR_SERVER,
  ERROR_MONGO_DUPLICATE_CODE,
} = require('../errors/errorCode');
const CreateItemError = require('../errors/CreateItemError');
const ExistItemError = require('../errors/ExistItemError');
const ServerError = require('../errors/ServerError');

const saltRounds = 10;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ allUsers: users }))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new ExistItemError('Передан несуществующий _id карточки.');
    })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') res.status(ERROR_CREATE).send({ message: 'Переданы некорректные данные при создании пользователя 1.' });
      else if (err.name === 'ExistItemError') res.status(err.statusCode).send({ message: err.message });
      else res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.getUserInfo = (req, res) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new ExistItemError('Передан несуществующий _id карточки.');
    })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        console.log('CastError')
        res.status(ERROR_CREATE).send({message: 'Переданы некорректные данные пользователя 2.'});
      }
      else if (err.name === 'ExistItemError') {
        console.log('ExistItemError')

        res.status(err.statusCode).send({message: err.message});
      }
      else res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  if (!email || !password) {
    throw new CreateItemError('Переданы некорректные данные при создании пользователя.');
  }
  bcrypt
    .hash(password, saltRounds)
    .then((hash) => {
      return User.create({ name, about, avatar, email, password: hash })
    })
    .then((user) => res.send({ newUser: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        //return Promise.reject(new CreateItemError('Переданы некорректные данные при создании пользователя.'))
        res.status(ERROR_CREATE).send({ message: 'Переданы некорректные данные при создании пользователя 3.' });
      }
      else if (err.code === ERROR_MONGO_DUPLICATE_CODE) res.status(ERROR_EXIST).send({ message: 'при регистрации указан email, который уже существует на сервере' })
      else res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию.', err: err });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new ExistItemError('Передан несуществующий _id карточки.');
    })
    .then((user) => res.send({ userUpdate: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') res.status(ERROR_CREATE).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      else if (err.name === 'ExistItemError') res.status(err.statusCode).send({ message: err.message });
      else res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new ExistItemError('Передан несуществующий _id карточки.');
    })
    .then((user) => res.send({ userUpdateAvatar: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') res.status(ERROR_CREATE).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      else if (err.name === 'ExistItemError') res.status(err.statusCode).send({ message: err.message });
      else res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию.' });
    });
};
