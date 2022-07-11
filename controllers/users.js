const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { ERROR_MONGO_DUPLICATE_CODE } = require('../errors/errorCode');
const RequestNotCorrectError = require('../errors/RequestNotCorrectError');
const ExistItemError = require('../errors/ExistItemError');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');

const saltRounds = 10;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ allUsers: users }))
    .catch(() => {
      next(new ServerError('Ошибка по умолчанию.'));
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Передан несуществующий _id карточки.');
    })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestNotCorrectError('Переданы некорректные данные'));
      } else if (err.name === 'NotFoundError') {
        next(err);
      } else {
        next(new ServerError('Ошибка по умолчанию.'));
      }
    });
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new ExistItemError('Передан несуществующий _id пользователя.');
    })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestNotCorrectError('Переданы некорректные данные'));
      } else if (err.name === 'ExistItemError') {
        next(err);
      } else {
        next(new ServerError('Ошибка по умолчанию.'));
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    throw new RequestNotCorrectError('Переданы некорректные данные при создании пользователя.');
  }
  bcrypt
    .hash(password, saltRounds)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      const newUser = {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      };
      res.send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestNotCorrectError('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === ERROR_MONGO_DUPLICATE_CODE) {
        next(new ExistItemError('При регистрации указан email, который уже существует на сервере'));
      } else if (err.name === 'RequestNotCorrectError') {
        next(err);
      } else {
        next(new ServerError('Ошибка по умолчанию.'));
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new ExistItemError('Передан несуществующий _id карточки.');
    })
    .then((user) => res.send({ userUpdate: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new RequestNotCorrectError('Переданы некорректные данные при обновлении профиля.'));
      } else if (err.name === 'ExistItemError') {
        next(err);
      } else {
        next(new ServerError('Ошибка по умолчанию.'));
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new ExistItemError('Передан несуществующий _id карточки.');
    })
    .then((user) => res.send({ userUpdateAvatar: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new RequestNotCorrectError('Переданы некорректные данные при обновлении профиля.'));
      } else if (err.name === 'ExistItemError') {
        next(err);
      } else {
        next(new ServerError('Ошибка по умолчанию.'));
      }
    });
};
