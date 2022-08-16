const express = require('express');
const userApi = express.Router();
const userController = require('../controllers/user');
const passportAuth = require('../middlewares/index');

// api: get  user
userApi.get('/', passportAuth.jwtAuthenticationCus, userController.getUser);

// api: update user
userApi.put('/update', userController.putUpdateUser);

module.exports = userApi;
