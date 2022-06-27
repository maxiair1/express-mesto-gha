const express = require('express');
const {PORT = 3000} = process.env;
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}, () => console.log('DB connected'));

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`)
})