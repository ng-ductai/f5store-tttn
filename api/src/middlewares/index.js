const passport = require("passport");
const GooglePlusTokenStrategy = require("passport-google-token").Strategy;
const AccountModel = require("../models/account/account");
const UserModel = require("../models/account/user");
const jwt = require("jsonwebtoken");
const express = require("express");

//authentication with JWT admin
const jwtAuthenticationAd = async (req, res, next) => {
  try {
    res.locals.isAuth = false;
    let token = null;
    if (express().get("env") === "production") token = req.query.token;
    else token = req.cookies.access_token;
    console.log("tokenjwt", token)
    
    if (!token) {
      next();
      return;
    }
    //verify jwt
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded) {
      const { accountId } = decoded.sub;
      const user = await AccountModel.findById(accountId);
      if (user) {
        res.locals.isAuth = true;
        req.user = user;
      }
    }
    next();
  } catch (error) {
    return res.status(407).json({
      message: "Unauthorized thiu token",
      error,
    });
  }
};

//authentication with JWT user
const jwtAuthenticationCus = async (req, res, next) => {
  try {
    res.locals.isAuth = false;
    let token = null;
    if (express().get("env") === "production") token = req.query.token;
    else token = req.cookies.accessToken;

    
    if (!token) {
      next();
      return;
    }
    //verify jwt
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded) {
      const { accountId } = decoded.sub;
      const user = await AccountModel.findById(accountId);
      if (user) {
        res.locals.isAuth = true;
        req.user = user;
      }
    }
    next();
  } catch (error) {
    return res.status(407).json({
      message: "Unauthorized thiu token",
      error,
    });
  }
};

// ! xác thực với google plus
passport.use(
  new GooglePlusTokenStrategy(
    {
      clientID:
        "853730244907-ghb2fanq9ro84784lkhdg8aumiao4dq1.apps.googleusercontent.com",
      clientSecret: "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",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, displayName } = profile;
        const picture = profile._json.picture;
        console.log("profile", profile);
        const email = profile.emails[0].value;
        // kiểm tra email đã tồn tại hay chưa
        const localUser = await AccountModel.findOne({
          email,
          authType: "local",
        });
        if (localUser) return done(null, localUser);

        const user = await AccountModel.findOne({
          googleId: id,
          authType: "google",
        });
        if (user) return done(null, user);

        // tạo account và user tương ứng
        const newAccount = await AccountModel.create({
          authType: "google",
          googleId: id,
          email,
        });

        const userName = email.slice(0, email.indexOf("@"));
        await UserModel.create({
          accountId: newAccount._id,
          email,
          fullName: displayName,
          userName: userName,
          avt: picture,
        });

        done(null, newAccount);
      } catch (error) {
        console.log(error);
        done(error, false);
      }
    }
  )
);

module.exports = {
  jwtAuthenticationAd,
  jwtAuthenticationCus,
};
