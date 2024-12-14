const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { auth } = require('../middleware/auth')

//api/users
router.get('', userController.getUsers)
router.get('/verify', auth, userController.verify);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/search', userController.searchUser)
router.get('/:user_id', auth, userController.singleUser);
router.post('/:user_id/follow', auth, userController.followUser);
router.delete('/:user_id/unfollow', auth, userController.unfollowUser);

module.exports = { userRouter: router}