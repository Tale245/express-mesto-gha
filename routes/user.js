const router = require('express').Router();
const {
  getUser,
  getUserId,
  updateProfile,
  updateAvatar,
  userInfo,
} = require('../controllers/user');

router.get('/users', getUser);
router.get('/users/me', userInfo);
router.get('/users/:id', getUserId);
router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
