const User = require('../models/user');
const {
  ERROR_REQUEST,
  ERROR_SERVER,
  FindByIdError,
} = require('../errors/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ allUsers: users }))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new FindByIdError('Передан несуществующий _id карточки.');
    })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      else res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ newUser: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      else res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new FindByIdError('Передан несуществующий _id карточки.');
    })
    .then((user) => res.send({ userUpdate: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      else res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new FindByIdError('Передан несуществующий _id карточки.');
    })
    .then((user) => res.send({ userUpdateAvatar: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      else res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию.' });
    });
};
