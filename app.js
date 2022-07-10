const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login } = require('./controllers/login');
const { createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { createUserValidation, loginValidation } = require('./middlewares/joiValidation');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true })
  .then(() => console.log('DB connected'))
  .catch((err) => console.log(`cant connect to db: ${err.message}`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);
app.use(errors());
app.use((err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message, err });
  }
  console.log(err.stack);
  res.status(500).send('что-то пошло не так');
  return next();
});
app.use((req, res) => res.status(404).send({ message: 'Страница не найдена.' }));

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
