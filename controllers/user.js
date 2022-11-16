const {
  NOT__FOUND_ERROR, BAD__REQUEST_ERROR, STATUS__OK, INTERNAL__SERVER_ERROR,
} = require('../constants/constants');

const BadRequestError = require('../Error/BadRequestError');

const User = require('../models/user');

module.exports.getUser = (req, res) => {
  User.find({})
    .then((data) => res.status(STATUS__OK).send(data))
    .catch(() => res.status(INTERNAL__SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new BadRequestError('Передан невалидный id пользователя');
    })
    .then((data) => res.status(STATUS__OK).send(data))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD__REQUEST_ERROR).send({ message: 'Передан невалидный id пользователя' });
      } else if (err.statusCode === NOT__FOUND_ERROR) {
        res.status(NOT__FOUND_ERROR).send({ message: 'Пользователь не найден' });
      } else {
        res.status(INTERNAL__SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((data) => res.status(STATUS__OK).send(data))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res
          .status(BAD__REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(INTERNAL__SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((data) => res.status(STATUS__OK).send(data))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res
          .status(BAD__REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные' });
      } else if (e.name === 'CastError') {
        res.status(BAD__REQUEST_ERROR).send({ message: 'Передан невалидный id пользователя' });
      } else {
        res.status(INTERNAL__SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((data) => res.status(STATUS__OK).send(data))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res
          .status(BAD__REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные' });
      } else if (e.name === 'CastError') {
        res.status(BAD__REQUEST_ERROR).send({ message: 'Передан невалидный id пользователя' });
      } else {
        res.status(INTERNAL__SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};
