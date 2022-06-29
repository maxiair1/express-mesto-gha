const User = require('../models/user');
const ERROR_REQUEST = 400;
const ERROR_NOTFOUND = 404;
const ERROR_SERVER = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then( users => res.send({allUsers: users}))
    .catch( () => res.status(ERROR_SERVER).send({message: "Ошибка по умолчанию."}))
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then( user => {
      if(user === null) res.status(ERROR_NOTFOUND).send({message: "Пользователь по указанному _id не найден."})
      else res.send({user: user})
    })
    .catch( err => {
      if(err.name === "CastError"){
        res.status(ERROR_REQUEST).send({message: "Переданы некорректные данные при создании пользователя."});
      }
      else {
        res.status(ERROR_SERVER).send({message: "Ошибка по умолчанию."})
      }
    })
}

module.exports.createUser = ( req, res ) => {
  console.log(req.body)
  const {name, about, avatar} = req.body;
  User.create({name, about, avatar})
    .then(user => res.send({newUser: user}))
    .catch(err => {
      if(err.name === "ValidationError") {
        res.status(ERROR_REQUEST).send({message: "Переданы некорректные данные при создании пользователя."});
      }
      else {
        res.status(ERROR_SERVER).send({message: "Ошибка по умолчанию."});
      }
    })
}

module.exports.updateUser = (req, res) => {
  const {name, about} = req.body;
  User.findByIdAndUpdate(req.user._id, {name, about},{new: true, runValidators: true})
    .then( user => {
      if(user === null) res.status(ERROR_NOTFOUND).send({message: "Пользователь по указанному _id не найден."})
      else res.send({userUpdate: user})
    })
    .catch( err => {
      if(err.name === "ValidationError"){
        res.status(ERROR_REQUEST).send({message: "Переданы некорректные данные при обновлении профиля."});
      }
      else if(err.name === "CastError"){
        res.status(ERROR_REQUEST).send({message: "Переданы некорректные данные при обновлении профиля."});
      }
      else {
        res.status(ERROR_SERVER).send({message: "Ошибка по умолчанию."})
      }
    })
}

module.exports.updateUserAvatar = (req, res) => {
  const {avatar} = req.body;
  User.findByIdAndUpdate(req.user._id, {avatar}, {new: true, runValidators: true})
    .then( user => {
      if(user === null) res.status(ERROR_NOTFOUND).send({message: "Пользователь по указанному _id не найден."})
      else res.send({userUpdateAvatar: user})
    })
    .catch( err => {
      if(err.name === "ValidationError" || err.name === "CastError"){
        res.status(ERROR_REQUEST).send({message: "Переданы некорректные данные при обновлении профиля."});
      }
      else {
        res.status(ERROR_SERVER).send({message: "Ошибка по умолчанию."})
      }
    })
}