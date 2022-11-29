const bcrypt = require('bcryptjs');
const {
  NOT__FOUND_ERROR, BAD__REQUEST_ERROR, STATUS__OK,
} = require('../constants/constants');

const NotFoundError = require('../Error/NotFoundError');
const BadRequestError = require('../Error/BadRequestError');

const User = require('../models/user');

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((data) => res.status(STATUS__OK).send(data))
    .catch(() => {
      next(new BadRequestError('Переданы некорректные данные'));
    });
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new NotFoundError('Передан невалидный id пользователя');
    })
    .then((data) => res.status(STATUS__OK).send(data))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.statusCode === NOT__FOUND_ERROR) {
        next(new NotFoundError('Запрашиваемая карточка не найдена'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((data) => res.status(STATUS__OK).send(data))
        .catch((e) => {
          if (e.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные'));
          } else {
            next(e);
          }
        });
    });
};

module.exports.updateProfile = (req, res, next) => {
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
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(e);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((data) => res.status(STATUS__OK).send(data))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res
          .status(BAD__REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные' });
      } else if (e.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(e);
      }
    });
};
module.exports.userInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Передан невалидный id пользователя');
    })
    .then((data) => res.status(STATUS__OK).send(data))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.statusCode === NOT__FOUND_ERROR) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        next(err);
      }
    });
};
