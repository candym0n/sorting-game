const express = require('express');
const UserController = require('./userController');
const { registerValidator, loginValidator } = require('./userValidator');
const router = express.Router();

router.post('/register', registerValidator, UserController.register);
router.post('/login', loginValidator, UserController.login);
router.post('/save', UserController.save);
router.post('/logout', UserController.logout);
router.get('/get-data', UserController.getUserData);
router.get('/get-user', UserController.getUser);
router.delete('/delete', UserController.deleteUser);

module.exports = router;
