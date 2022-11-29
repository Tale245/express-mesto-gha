// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizedError = require('../Error/UnauthorizedError');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      res.cookie('id', user._id, { httpOnly: true }).send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Ошибка авторизации'));
    });
};
