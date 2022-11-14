const Сard = require('../models/card');

const {
  NOT__FOUND, VALIDATION__ERROR, STATUS__OK, UNKNOW__ERROR,
} = require('../constants/constants');

module.exports.getCards = (req, res) => {
  Сard
    .find({})
    .then((data) => {
      res.status(STATUS__OK).send(data);
    })
    .catch(() => res.status(UNKNOW__ERROR).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Сard
    .create({ name, link, owner })
    .then((data) => res.status(STATUS__OK).send(data))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(VALIDATION__ERROR).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(UNKNOW__ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Сard
    .findByIdAndRemove(req.params.id)
    .orFail(() => {
      throw new Error('Передан невалидный id пользователя');
    })
    .then((data) => res.status(STATUS__OK).send(data))
    .catch((e) => {
      if (e.name === 'CastError') {
        res.status(VALIDATION__ERROR).send({ message: 'Переданы некорректные данные' });
      } else if (e.statusCode === NOT__FOUND) {
        res.status(NOT__FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
      } else {
        res.status(UNKNOW__ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Сard
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => {
      throw new Error('Передан невалидный id пользователя');
    })
    .then((data) => res.status(STATUS__OK).send(data))
    .catch((e) => {
      if (e.name === 'CastError') {
        res.status(VALIDATION__ERROR).send({ message: 'Переданы некорректные данные' });
      } else if (e.statusCode === NOT__FOUND) {
        res.status(NOT__FOUND).send({
          message: 'Запрашиваемая карточка не найдена',
        });
      } else {
        res.status(UNKNOW__ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Сard
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => {
      throw new Error('Передан невалидный id пользователя');
    })
    .then((data) => res.status(STATUS__OK).send(data))
    .catch((e) => {
      if (e.name === 'CastError') {
        res.status(VALIDATION__ERROR).send({ message: 'Переданы некорректные данные' });
      } else if (e.statusCode === NOT__FOUND) {
        res.status(NOT__FOUND).send({
          message: 'Запрашиваемая карточка не найдена',
        });
      } else {
        res.status(UNKNOW__ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};
