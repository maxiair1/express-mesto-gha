const router = require('express').Router();
const {
  getUsers, getUserById, updateUser, updateUserAvatar, getUserInfo,
} = require('../controllers/users');
const {
  userIdValidation, updateUserValidation, updateAvatarValidation,
} = require('../middlewares/joiValidation');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', userIdValidation, getUserById);
router.patch('/me', updateUserValidation, updateUser);
router.patch('/me/avatar', updateAvatarValidation, updateUserAvatar);

module.exports = router;
