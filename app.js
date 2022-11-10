const express = require("express");
const mongoose = require("mongoose");
const user = require("./models/user");
const card = require("./models/card");
const bodyParser = require("body-parser");
const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use(bodyParser.json());

// РОУТЫ ДАННЫХ ПОЛЬЗОВАТЕЛЯ

// получение данных пользователя
app.get("/users", (req, res) => {
  user
    .find({})
    .then((data) => res.status(200).send(data))
    .catch((e) => {
      if (e.status === 404) {
        res.status(404).send({ message: "Запрашиваемый пользователь не найден" });
      } else if (e.status === 404) {
        res.status(400).send({ message: "Передан невалидный id пользователя" });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
});

// получение данных конкретного пользователя по id
app.get("/users/:id", (req, res) => {
  user
    .findById(req.params.id)
    .then((data) => res.status(200).send(data))
    .catch((e) => {res.status(404).send({ message: "Запрашиваемый пользователь не найден" });
    });
});

// создание пользователя
app.post("/users", (req, res) => {
  const { name, about, avatar } = req.body;
  user
    .create({ name, about, avatar })
    .then((data) => res.status(200).send(data))
    .catch((e) => {
      if (e.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные" });
      } else {
        return res.status(500).send({ message: "Произошла ошибка" });
      }
    });
});

// хардкод айди пользователя, создавшего краточку
app.use((req, res, next) => {
  req.user = {
    _id: "636974c5ff0cbf5637c13f3f", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

// РОУТУ ДАННЫХ КАРТЧКИ

// получение данных всех карточек
app.get("/cards", (req, res) => {
  card
    .find({})
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        return res
          .status(404)
          .send({ message: "Запрашиваемая карточка не найдена" });
      } else {
        return res.status(500).send({ message: "Произошла ошибка" });
      }
    });
});

// создание карточки
app.post("/cards", (req, res) => {
  const { name, link, owner = req.user._id } = req.body;

  card
    .create({ name, link, owner })
    .then((data) => res.status(200).send(data))
    .catch((e) => {
      if (e.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные" });
      } else {
        return res.status(500).send({ message: "Произошла ошибка" });
      }
    });
});
// удаление карточки по id
app.delete("/cards/:id", (req, res) => {
  card
    .findByIdAndRemove(req.params.id)
    .then((data) => res.status(200).send(data))
    .catch((e) => {
      if (e.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные" });
      } else {
        return res.status(500).send({ message: "Произошла ошибка" });
      }
    });
});

// ДОПОЛНИТЕЛЬНЫЕ РОУТЫ

// обновление профиля
app.patch("/users/me", (req, res) => {
  const { name, about } = req.body;

  user
    .findByIdAndUpdate(req.user._id, { name: name, about: about })
    .then((data) => res.status(200).send(data))
    .catch((e) => {
      if (e.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные" });
      } else {
        return res.status(500).send({ message: "Произошла ошибка" });
      }
    });
});

// обновление аватара профиля
app.patch("/users/me/avatar", (req, res) => {
  const { avatar } = req.body;

  user
    .findByIdAndUpdate(req.user._id, { avatar: avatar })
    .then((data) => res.status(200).send(data))
    .catch((e) => {
      if (e.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные" });
      } else {
        return res.status(500).send({ message: "Произошла ошибка" });
      }
    });
});

// поставить лайк карточке
app.put("/cards/:cardId/likes", (req, res) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .then((data) => res.status(200).send(data))
    .catch((e) => {
      if (e.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные" });
      } else {
        return res.status(500).send({ message: "Произошла ошибка" });
      }
    });
});

// удалить лайк у карточки
app.delete("/cards/:cardId/likes", (req, res) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .then((data) => res.status(200).send(data))
    .catch((e) => {
      if (e.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные" });
      } else {
        return res.status(500).send({ message: "Произошла ошибка" });
      }
    });
});

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`server has been started on port ${PORT}`);
});
