const router = require("express").Router();
const {
  getUser,
  getUserId,
  createUser,
  updateProfile,
  updateAvatar,
} = require("../controllers/user");

router.get("/users", getUser);
router.get("/users/:id", getUserId);
router.post("/users", createUser);
router.patch("/users/me", updateProfile);
router.patch("/users/me/avatar", updateAvatar);

module.exports = router;
