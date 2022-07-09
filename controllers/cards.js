const Card = require('../models/card');
const {
  ERROR_CREATE,
  ERROR_NOT_CORRECT,
  ERROR_DELETE,
  ERROR_NOT_FOUND,
  ERROR_EXIST,
  ERROR_SERVER,
} = require('../errors/errorCode');
const ExistItemError = require('../errors/ExistItemError');
const DeleteItemError = require('../errors/DeleteItemError');
const CreateItemError = require('../errors/CreateItemError');
const ServerError = require('../errors/ServerError');

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
        res.status(ERROR_CREATE).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
      } else if (err.name === 'ExistItemError') res.status(err.statusCode).send({ message: err.message });
      else res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findOne({_id: req.params.cardId})
    .orFail(() => {
      throw new ExistItemError('Передан несуществующий _id карточки.');
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        console.log(card.owner.toString(), req.user._id);
        throw new DeleteItemError('попытка удалить чужую карточку');
      }
      return Card.deleteOne({ _id: card._id.toString() });
    })
    .then((deletedCard) => {
      res.send({ cardDelete: deletedCard })
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // res.status(ERROR_CREATE).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
        err = new CreateItemError('Переданы некорректные данные для даления карточки.')
      }
      // else if (err.name === 'FindByIdError') res.status(err.statusCode).send({ message: err.message });
      // else res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию 1.', err: err.message});
        next(err)
    });

  // Card.findByIdAndDelete(req.params.cardId)
  //   .orFail(() => {
  //     throw new ExistItemError('Передан несуществующий _id карточки.');
  //   })
  //   .then((card) => res.send({ cardDelete: card }))
  //   .catch((err) => {
  //     if (err.name === 'CastError') {
  //       res.status(ERROR_CREATE).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
  //     } else if (err.name === 'FindByIdError') res.status(err.statusCode).send({ message: err.message });
  //     else res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию.' });
  //   });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new ExistItemError('Передан несуществующий _id карточки.');
    })
    .then((likeCard) => res.send({ like: likeCard }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CREATE).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      } else if (err.name === 'ExistItemError') res.status(err.statusCode).send({ message: err.message });
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
      throw new ExistItemError('Передан несуществующий _id карточки.');
    })
    .then((dislikeCard) => {
      res.send({ dislike: dislikeCard });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CREATE).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      } else if (err.name === 'FindByIdError') res.status(err.statusCode).send({ message: err.message });
      else res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию.' });
    });
};
