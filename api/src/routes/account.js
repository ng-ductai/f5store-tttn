const accountApi = require('express').Router();
const accountController = require('../controllers/account');

// api: gửi mã xác nhận để đăng ký tài khoản
accountApi.post('/verify', accountController.postSendVerifyCode);

// api: đăng ký tài khoản
accountApi.post('/signup', accountController.postSignUp);

// api: gửi mã xác nhận để lấy lại mật khẩu
accountApi.post('/verify/forgot', accountController.postSendCodeForgotPW);

// api: reset password
accountApi.post('/reset-pw', accountController.postResetPassword);

// api: reset password
accountApi.put('/update-pw', accountController.putUpdatePassword);


module.exports = accountApi;
