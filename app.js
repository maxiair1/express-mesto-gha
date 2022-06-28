const express = require('express');
const {PORT = 3000} = process.env;
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,})
  .then( () => console.log('DB connected'))
  .catch((err) => console.log(`cant connect to db: ${err.message}`));

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    "_id": "62baa22a52f1064814275157",
  };
  next();
})

app.use('/users', userRouter);
app.use('/cards', cardRouter);


// app.post('/users', (req, res) => {
//   console.log(req.method)
//   console.log(req.headers)
//   console.log(req.body)
//   res.send(req.body)
// })
app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`)
})

const test = {
  "name": "test user",
  "about": "test about",
  "avatar": "http://test.ru",
  "_id": "62baa22a52f1064814275157",
}
const card = {
  "name": "card1",
  "link": "link1",
}
const options = {
  useCreateIndex: true,
  useFindAndModify: false
}