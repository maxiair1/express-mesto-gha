const Card = require('../models/card');
const {
  ERROR_REQUEST,
  ERROR_NOTFOUND,
  ERROR_SERVER,
  FindByIdError,
} = require('../errors/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ allCards: cards }))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_NOTFOUND).send({ message: 'Пользователь с указанным _id не найден.' });
      } else if (err.name === 'FindByIdError') res.send({ message: err.message });
      else res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(() => {
      throw new FindByIdError('Передан несуществующий _id карточки.');
    })
    .then((card) => res.send({ cardDelete: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      } else if (err.name === 'FindByIdError') res.send({ message: err.message });
      else res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new FindByIdError('Передан несуществующий _id карточки.');
    })
    .then((likeCard) => res.send({ like: likeCard }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      } else if (err.name === 'FindByIdError') res.send({ message: err.message });
      else res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new FindByIdError('Передан несуществующий _id карточки.');
    })
    .then((dislikeCard) => {
      res.send({ dislike: dislikeCard });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      } else if (err.name === 'FindByIdError') res.send({ message: err.message });
      else res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию.' });
    });
};
