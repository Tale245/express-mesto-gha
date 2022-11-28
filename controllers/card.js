const Сard = require('../models/card');

const {
  NOT__FOUND_ERROR, BAD__REQUEST_ERROR, STATUS__OK, INTERNAL__SERVER_ERROR,
} = require('../constants/constants');

const BadRequestError = require('../Error/BadRequestError');

module.exports.getCards = (req, res) => {
  Сard
    .find({})
    .populate(['owner', 'likes'])
    .then((data) => {
      res.status(STATUS__OK).send(data);
    })
    .catch(() => res.status(INTERNAL__SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Сard
    .create({ name, link, owner })
    .then((data) => res.status(STATUS__OK).send(data))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(BAD__REQUEST_ERROR).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(INTERNAL__SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Сard.findById(req.params.id)
    .populate('owner')
    .then((data) => {
      if (data.owner.id === req.user._id) {
        Сard
          .findByIdAndRemove(req.params.id)
          .orFail(() => {
            throw new BadRequestError('Передан невалидный id пользователя');
          })
          .then(() => res.status(STATUS__OK).send(data))
          .catch((e) => {
            if (e.name === 'CastError') {
              res.status(BAD__REQUEST_ERROR).send({ message: 'Переданы некорректные данные' });
            } else if (e.statusCode === NOT__FOUND_ERROR) {
              res.status(NOT__FOUND_ERROR).send({ message: 'Запрашиваемая карточка не найдена' });
            } else {
              res.status(INTERNAL__SERVER_ERROR).send({ message: 'Произошла ошибка' });
            }
          });
      } else {
        res.status(403).send({ message: 'Вы не можете удалить чужую карточку' });
      }
    }).catch((e) => {
      if (e.name === 'CastError') {
        res.status(BAD__REQUEST_ERROR).send({ message: 'Переданы некорректные данные' });
      } else if (e.statusCode === NOT__FOUND_ERROR) {
        res.status(NOT__FOUND_ERROR).send({ message: 'Запрашиваемая карточка не найдена' });
      } else {
        res.status(INTERNAL__SERVER_ERROR).send({ message: 'Произошла ошибка' });
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
      throw new BadRequestError('Передан невалидный id пользователя');
    })
    .then((data) => res.status(STATUS__OK).send(data))
    .catch((e) => {
      if (e.name === 'CastError') {
        res.status(BAD__REQUEST_ERROR).send({ message: 'Переданы некорректные данные' });
      } else if (e.statusCode === NOT__FOUND_ERROR) {
        res.status(NOT__FOUND_ERROR).send({
          message: 'Запрашиваемая карточка не найдена',
        });
      } else {
        res.status(INTERNAL__SERVER_ERROR).send({ message: 'Произошла ошибка' });
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
      throw new BadRequestError('Передан невалидный id пользователя');
    })
    .then((data) => res.status(STATUS__OK).send(data))
    .catch((e) => {
      if (e.name === 'CastError') {
        res.status(BAD__REQUEST_ERROR).send({ message: 'Переданы некорректные данные' });
      } else if (e.statusCode === NOT__FOUND_ERROR) {
        res.status(NOT__FOUND_ERROR).send({
          message: 'Запрашиваемая карточка не найдена',
        });
      } else {
        res.status(INTERNAL__SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};
