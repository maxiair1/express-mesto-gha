const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then( users => res.send({allUsers: users}))
    .catch( err => res.status(500).send({message: err.message}))
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then( user => res.send({ user: user}))
    .catch( err => res.status(500).send({message: err.message}))
}

module.exports.createUser = ( req, res ) => {
  console.log(req.body)
  const {name, about, avatar} = req.body;
  User.create({name, about, avatar})
    .then(user => res.send({newUser: user}))
    .catch(err => res.status(500).send({message: err.message}))
}