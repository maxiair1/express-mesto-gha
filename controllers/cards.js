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
  console.log(req.body)
}