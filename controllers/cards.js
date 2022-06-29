const Card = require('../models/card');
const ERROR_REQUEST = 400;
const ERROR_NOTFOUND = 401;
const ERROR_SERVER = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then( cards => res.send({allCards: cards}))
    .catch(() => res.status(ERROR_SERVER).send({message: "Ошибка по умолчанию."}))
}

module.exports.createCard = (req, res) => {
  const {name, link } = req.body;
  Card.create({ name, link, owner: req.user._id})
    .then( card => res.send({card: card}))
    .catch(err => {
      if(err.name === "ValidationError"){
        res.status(ERROR_REQUEST).send({message: "Переданы некорректные данные при создании карточки."});
      }
      else if(err.name === "CastError"){
        res.status(ERROR_NOTFOUND).send({message: "Пользователь с указанным _id не найден."});
      }
      else {
        res.status(ERROR_SERVER).send({message: "Ошибка по умолчанию."})
        }
    })
}

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then( card => {
      if(card === null){
        res.status(ERROR_NOTFOUND).send({message: "Передан несуществующий _id карточки."})
      }
      else res.send({cardDelete: card})
    })
    .catch( err => {
      if(err.name === "CastError"){
        res.status(ERROR_REQUEST).send({message: "Переданы некорректные данные для постановки/снятии лайка."});
      }
      else {
        res.status(ERROR_SERVER).send({message: "Ошибка по умолчанию."})
      }
    })
}

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$addToSet: {likes: req.user._id}}, // добавить _id в массив, если его там нет
    {new: true}
  )
    .then( likeCard => {
      if(likeCard === null){
        res.status(ERROR_NOTFOUND).send({message: "Передан несуществующий _id карточки."})
      }
      else res.send({like: likeCard})
    })
    .catch( err => {
      if(err.name === "CastError"){
        res.status(ERROR_REQUEST).send({message: "Переданы некорректные данные для постановки/снятии лайка."});
      }
      else {
        res.status(ERROR_SERVER).send({message: "Ошибка по умолчанию."})
      }
    })
}

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$pull: {likes: req.user._id}}, // убрать _id из массива
    {new: true}
  ).then( dislikeCard => {
    if(dislikeCard === null){
      res.status(ERROR_NOTFOUND).send({message: "Передан несуществующий _id карточки."})
    }
    else res.send({dislike: dislikeCard})
  })
    .catch( err => {
      if(err.name === "CastError"){
        res.status(ERROR_REQUEST).send({message: "Переданы некорректные данные для постановки/снятии лайка."});
      }
      else {
        res.status(ERROR_SERVER).send({message: "Ошибка по умолчанию."})
      }
    })
}