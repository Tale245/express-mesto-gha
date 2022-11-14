const {
  NOT__FOUND, VALIDATION__ERROR, STATUS__OK, UNKNOW__ERROR,
} = require('../constants/constants');

const User = require('../models/user');

module.exports.getUser = (req, res) => {
  User.find({})
    .then((data) => res.status(STATUS__OK).send(data))
    .catch(() => res.status(UNKNOW__ERROR).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new Error('Передан невалидный id пользователя');
    })
    .then((data) => res.status(STATUS__OK).send(data))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(VALIDATION__ERROR).send({ message: 'Передан невалидный id пользователя' });
      } else if (err.statusCode === NOT__FOUND) {
        res.status(NOT__FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(UNKNOW__ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((data) => res.status(STATUS__OK).send(data))
    // eslint-disable-next-line consistent-return
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res
          .status(VALIDATION__ERROR)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        return res.status(UNKNOW__ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { runValidators: true },
  )
    .then(() => res.status(STATUS__OK).send({ name, about }))
    // eslint-disable-next-line consistent-return
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res
          .status(VALIDATION__ERROR)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        return res.status(UNKNOW__ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar })
    .then(() => res.status(STATUS__OK).send(req.body))
    // eslint-disable-next-line consistent-return
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res
          .status(VALIDATION__ERROR)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        return res.status(UNKNOW__ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};
