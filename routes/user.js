const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser,
  getUserId,
  updateProfile,
  updateAvatar,
  userInfo,
} = require('../controllers/user');

router.get('/users', getUser);
router.get('/users/me', celebrate({
  body: Joi.object().keys({
    me: Joi.string().alphanum().length(24),
  }),
}), userInfo);
router.get('/users/:id', celebrate({
  body: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getUserId);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);
// router.patch('/users/me/avatar', updateAvatar);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), updateAvatar);

module.exports = router;
