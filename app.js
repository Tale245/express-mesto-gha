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
    .catch((e) => console.log(e.message));
});

// получение данных конкретного пользователя по id
app.get("/users/:id", (req, res) => {
  user
    .findById(req.params.id)
    .orFail(() => {
      throw new Error("Передан невалидный id пользователя");
    })
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({ message: "Передан невалидный id пользователя" });
      } else if (err.name === "Error") {
        console.log(err.name);
        res.status(404).send({ message: "Пользователь не найден" });
      } else {
        console.log(err.name);
        res.status(500).send({ message: "Произошла ошибка" });
      }
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

app.use((req, res, next) => {
  res.status(404).send({message: 'Страница по данному маршруту не найдена'})

  next()
})

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
        res.status(400).send({ message: "Переданы некорректные данные" });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
});
// удаление карточки по id
app.delete("/cards/:id", (req, res) => {
  card
    .findByIdAndRemove(req.params.id)
    .orFail(() => {
      throw new Error("Передан невалидный id пользователя");
    })
    .then((data) => res.status(200).send(data))
    .catch((e) => {
      console.log(e.name);
      if (e.name === "CastError") {
        res.status(400).send({ message: "Переданы некорректные данные" });
      } else if (e.name === "Error") {
        res.status(404).send({ message: "Запрашиваемая карточка не найдена" });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
});

// ДОПОЛНИТЕЛЬНЫЕ РОУТЫ

// обновление профиля
app.patch("/users/me", (req, res) => {
  const { name, about } = req.body;

  user
    .findByIdAndUpdate(
      req.user._id,
      { name: name, about: about },
      { runValidators: true }
    )
    .then(() => res.status(200).send(req.body))
    .catch((e) => {
      console.log(e);
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
    .then(() => res.status(200).send(req.body))
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
    .orFail(() => {
      throw new Error("Передан невалидный id пользователя");
    })
    .then((data) => res.status(200).send(data))
    .catch((e) => {
      if (e.name === "CastError") {
        res.status(400).send({ message: "Переданы некорректные данные" });
      } else if (e.name === "Error") {
        res.status(404).send({
          message: "Запрашиваемая карточка не найдена",
        });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
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
    .orFail(() => {
      throw new Error("Передан невалидный id пользователя");
    })
    .then((data) => res.status(200).send(data))
    .catch((e) => {
      if (e.name === "CastError") {
        res.status(400).send({ message: "Переданы некорректные данные" });
      } else if (e.name === "Error") {
        res.status(404).send({
          message: "Запрашиваемая карточка не найдена",
        });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
});

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`server has been started on port ${PORT}`);
});
