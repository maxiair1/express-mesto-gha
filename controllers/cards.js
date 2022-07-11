const Card = require('../models/card');
const ForbiddenActionError = require('../errors/ForbiddenActionError');
const RequestNotCorrectError = require('../errors/RequestNotCorrectError');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ allCards: cards }))
    .catch(() => {
      next(new ServerError('Ошибка по умолчанию.'));
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestNotCorrectError('Переданы некорректные данные при создании карточки.'));
      } else if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь с указанным _id не найден.'));
      } else {
        next(new ServerError('Ошибка по умолчанию.'));
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findOne({ _id: req.params.cardId })
    .orFail(() => {
      throw new NotFoundError('Передан несуществующий _id карточки.');
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenActionError('попытка удалить чужую карточку');
      }
      return Card.deleteOne({ _id: card._id.toString() });
    })
    .then((deletedCard) => {
      res.send({ cardDelete: deletedCard });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestNotCorrectError('Переданы некорректные данные для удаления карточки.'));
      } else if (err.name === 'NotFoundError') {
        next(err);
      } else if (err.name === 'ForbiddenActionError') {
        next(err);
      } else {
        next(new ServerError('Ошибка по умолчанию.'));
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Передан несуществующий _id карточки.');
    })
    .then((likeCard) => res.send({ like: likeCard }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestNotCorrectError('Переданы некорректные данные для постановки/снятии лайка.'));
      } else if (err.name === 'NotFoundError') {
        next(err);
      } else {
        next(new ServerError('Ошибка по умолчанию.'));
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Передан несуществующий _id карточки.');
    })
    .then((dislikeCard) => {
      res.send({ dislike: dislikeCard });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestNotCorrectError('Переданы некорректные данные для постановки/снятии лайка.'));
      } else if (err.name === 'NotFoundError') {
        next(err);
      } else {
        next(new ServerError('Ошибка по умолчанию.'));
      }
    });
};
