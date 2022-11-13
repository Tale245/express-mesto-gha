const User = require("../models/user");

module.exports.getUser = (req, res) => {
  User.find({})
    .then((data) => res.status(200).send(data))
    .catch((e) => console.log(e.message));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.id)
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
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
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
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
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
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar: avatar })
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
};
