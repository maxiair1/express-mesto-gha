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

module.exports.updateUser = (req, res) => {
  const {name, about} = req.body;
  User.findByIdAndUpdate(req.user._id, {name, about},{new: true, runValidators: true})
    .then( user => res.send({userUpdate: user}))
    .catch( err => res.status(500).send({message: err.message}))
}

module.exports.updateUserAvatar = (req, res) => {
  const {avatar} = req.body;
  User.findByIdAndUpdate(req.user._id, {avatar}, {new: true, runValidators: true})
    .then( user => res.send({userUpdateAvatar: user}))
    .catch( err => res.status(500).send({message: err.message}))
}