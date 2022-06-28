const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then( cards => res.send({allCards: cards}))
    .catch((err) => res.status(500).send({message: err.message}))
}

module.exports.createCard = (req, res) => {
  const {name, link } = req.body;
  console.log(req.user._id);
  Card.create({ name, link, owner: req.user._id})
    .then( card => res.send({card: card}))
    .catch(err => res.status(500).send({message: err.message}));
}

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then( card => res.send({cardDelete: card}))
    .catch( err => res.status(500).send({message: err.message}))
}

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$addToSet: {likes: req.user._id}}, // добавить _id в массив, если его там нет
    {new: true},
  ).then( likeCard => res.send({ like: likeCard}))
    .catch( err => res.status(500).send({message: err.message}))
}

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$pull: {likes: req.user._id}}, // убрать _id из массива
    {new: true},
  ).then( dislikeCard => res.send({ dislike: dislikeCard}))
    .catch( err => res.status(500).send({message: err.message}))
}