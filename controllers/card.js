const card = require("../models/card");

module.exports.getCards = (req, res) => {
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
};

module.exports.createCard = (req, res) => {
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
};

module.exports.deleteCard = (req, res) => {
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
};

module.exports.likeCard = (req, res) => {
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
};

module.exports.dislikeCard = (req, res) => {
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
};
