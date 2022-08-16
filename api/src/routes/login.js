const loginApi = require('express').Router();
const loginController = require('../controllers/login');

// passportAuth middleware để config passport
const passportAuth = require('../middlewares/index');
const passport = require('passport');

// api: login with local
loginApi.post('/', loginController.postLogin);

// api: login with gg
loginApi.post(
  '/gg',
  passport.authenticate('google-token', { session: false }),
  loginController.postLoginWithGoogle,
);

// api: authenticated with jwt
loginApi.get('/auth', passportAuth.jwtAuthenticationCus, loginController.getAuth);

// api: refresh token
loginApi.post('/refresh_token', loginController.postRefreshToken);

// api: logout
loginApi.post('/logout', loginController.postLogout);

module.exports = loginApi;
