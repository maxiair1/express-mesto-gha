const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login } = require('./controllers/login');
const { createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true })
  .then(() => console.log('DB connected'))
  .catch((err) => console.log(`cant connect to db: ${err.message}`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = { _id: '62baa22a52f1064814275157' };
  next();
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);
app.use((err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({message: err.message, err});
  }
  console.log(err.stack);
  res.status(500).send('что-то пошло не так');
  next();
});
app.use((req, res) => res.status(404).send({ message: 'Страница не найдена.' }));

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});

const test = {
  "_id": "62c6d472ae17c94a92268661",
  "name": "Жак-Ив Кусто",
  "about": "Исследователь",
  "avatar": "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
  "email": "test2@ya.ru",
  "password": "$2a$10$W.THFruPVT1SCYxh/j4SYe2CszUuUVx5zZlv2Fo58fGaf4zVyHHLu",
  "__v": 0,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmM2ZDQ3MmFlMTdjOTRhOTIyNjg2NjEiLCJpYXQiOjE2NTcyMDgzNjcsImV4cCI6MTY1NzgxMzE2N30.CCz_zpoGntWHCNctAeDLYnSjkCg8wR325JnAnwH9Klw"
}