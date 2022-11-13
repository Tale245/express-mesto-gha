const express = require("express");
const mongoose = require("mongoose");
const user = require("./models/user");
const card = require("./models/card");
const bodyParser = require("body-parser");
const userRouter = require("./routes/user");
const cardRouter = require("./routes/card");
const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use(bodyParser.json());

// хардкод айди пользователя, создавшего краточку
app.use((req, res, next) => {
  req.user = {
    _id: "636974c5ff0cbf5637c13f3f", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

// РОУТЫ ДАННЫХ ПОЛЬЗОВАТЕЛЯ

app.use("/", userRouter);
app.use("/", cardRouter);

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`server has been started on port ${PORT}`);
});
