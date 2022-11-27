const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');
const auth = require('./middlewares/auth');
const { login } = require('./controllers/login');
const { createUser } = require('./controllers/user');
const { NOT__FOUND_ERROR } = require('./constants/constants');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());

// хардкод айди пользователя, создавшего краточку

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/', userRouter);
app.use('/', cardRouter);

app.use((req, res) => {
  res.status(NOT__FOUND_ERROR).send({ message: 'Страница по указанному маршруту не найдена' });
});

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`server has been started on port ${PORT}`);
});
