const UserModel = require("../../models/account/user");
const AccountModel = require("../../models/account/account");
const mailConfig = require("../../configs/mail");
const constants = require("../../constants");
const bcrypt = require("bcryptjs");
const jwtConfig = require("../../configs/jwt");
const jwt = require("jsonwebtoken");
const express = require("express");

// api: get info admin
const getUser = async (req, res, next) => {
  try {
    //if check authentication wrong then return error
    console.log(" res.locals.isAuth", res.locals.isAuth)
    if (!res.locals.isAuth)
    
      return res
        .status(400)
        .json({ message: "Không thể lấy thông tin user !", error });
    //else get information user -> send client
    const { _id } = req.user;
    const infoUser = await UserModel.findOne({ accountId: _id }).populate({
      path: "accountId",
      select: "email _id password ",
    });

    //send information user except _id
    const infoUserSend = {
      ...infoUser._doc,
      email: infoUser.accountId.email,
      password: infoUser.accountId.password,
      accountId: infoUser.accountId._id,
    };

    res.status(200).json({ user: infoUserSend });
  } catch (error) {
    res.status(400).json({ message: "Không thể lấy thông tin user !!!", error });
  }
};

//Đăng ký tài khoản admin
const postAddAdmin = async (req, res, next) => {
  try {
    const { email, password, userName, fullName, phone, gender, birthday } =
      req.body.account;

    //Kiểm tra tài khoản đã tồn tại hay chưa
    const account = await AccountModel.findOne({ email });

    //nếu tồn tại, thông báo lỗi, return
    if (account) {
      let suffixError =
        account.authType === "local"
          ? ""
          : `bởi đăng nhập với ${account.authType}`;
      let error = `Email đã được sử dụng ${suffixError} !`;

      if (account) return res.status(400).json({ message: error });
    }

    // Tạo tạo tài khoản và user tương ứng
    const newAcc = await AccountModel.create({
      email,
      password,
      authType: "local",
      role: "1",
      isActive: true,
    });

    if (newAcc) {
      await UserModel.create({
        accountId: newAcc._id,
        userName,
        fullName,
        phone,
        gender,
        birthday,
      });
    }
    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(400).json({
      message: "Account Creation Failed.",
      error,
    });
  }
};

// api: đăng nhập với admin
const postLogin = async (req, res, next) => {
  try {
    const { email, password, keepLogin } = req.body.account;

    // kiểm tra tài khoản có tồn tại không?
    const account = await AccountModel.findOne({
      email,
      authType: "local",
      role: "1",
    });
    if (!account) {
      return res.status(406).json({ message: "Tài khoản không tồn tại !" });
    }

    /*  Kiểm tra trạng thái tài khoản */
    let { isActive } = account;
    if (isActive === false) {
      return res
        .status(401)
        .json({ isActive, message: "Tài khoản đã bị khóa !" });
    }

    /*
      Kiểm tra số lần đăng nhập tránh trường hợp user f5 trang để
      đăng nhập tiếp sau khi đn sai quá nhiều
    */
    let { failedLoginTimes } = account;
    if (failedLoginTimes >= constants.MAX_FAILED_LOGIN_TIMES) {
      return res
        .status(401)
        .json({ failedLoginTimes, message: "Quá số lần đăng nhập sai !" });
    }

    // kiểm tra password
    const isMatch = await bcrypt.compare(password, account.password);

    // ! sai mật khẩu -> thất bại
    if (!isMatch) {
      // tăng số lần đăng nhập thất bại
      ++failedLoginTimes;
      if (failedLoginTimes <= constants.MAX_FAILED_LOGIN_TIMES) {
        await AccountModel.updateOne(
          { _id: account._id },
          { failedLoginTimes }
        );
      } else {
        // gửi thông báo đến mail
        const mail = {
          to: email,
          subject: "Cảnh báo quá số lần đăng nhập",
          html: mailConfig.htmlWarningLogin(),
        };
        await mailConfig.sendEmail(mail);
      }
      //return error
      return res
        .status(401)
        .json({ failedLoginTimes, message: "Mật khẩu không đúng !" });
    } else {
      // ! đăng nhập thành công
      // tạo mã refresh token
      const refreshToken = await jwtConfig.encodedToken(
        process.env.JWT_SECRET_REFRESH_KEY,
        { accountId: account._id, keepLogin },
        constants.JWT_REFRESH_EXPIRES_TIME
      );

      // Note: create JWToken -> send client
      const token = await jwtConfig.encodedToken(process.env.JWT_SECRET_KEY, {
        accountId: account._id,
      });

      // lưu refresh token và đặt số lần đn sai = 0
      await AccountModel.updateOne(
        { _id: account._id },
        { failedLoginTimes: 0, refreshToken }
      );

      if (express().get("env") === "production") {
        console.log("tokenadmin", token)
        if (token)
          // ! Dyno Heroku không cho set cookie cross domain (#.herokuapp.com)
          // ! Nên ta sẽ lưu nó vào trong localStorage (key=t)
          return res
            .status(200)
            .json({ token, refreshToken, message: "success" });
      } else {
        //nếu không duy trì đăng nhập thì giữ trạng thái sống token là session
        const expiresIn = keepLogin
          ? new Date(Date.now() + constants.COOKIE_EXPIRES_TIME)
          : 0;
        // ! gửi token lưu vào cookie và chỉ đọc
        res.cookie("access_token", token, {
          httpOnly: true,
          expires: expiresIn,
        });
        return res.status(200).json({ refreshToken, message: "success" });
      }
    }
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Đăng nhập thất bại. Thử lại", error });
  }
};

// check authenticate with jwt -> return isAuth
const getAuth = (req, res, next) => {
  if (res.locals.isAuth) return res.json({ isAuth: res.locals.isAuth });
  return res.json({ isAuth: false });
};

// refresh jwt token
const postRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.body.refresh_token;
    const account = await AccountModel.findOne({ refreshToken });
    if (!account) {
      return res.status(403).json({ message: "Invalid Token" });
    }
    //verify token
    const decoded = await jwt.verify(
      refreshToken,
      process.env.JWT_SECRET_REFRESH_KEY
    );
    const { userID, keepLogin } = decoded.sub;
    //create new access_token -> set cookie
    const newAccessToken = await jwtConfig.encodedToken(
      process.env.JWT_SECRET_KEY,
      { userID }
    );
    //cookies expires if no keep Login then 0
    const expiresIn = keepLogin
      ? new Date(Date.now() + constants.COOKIE_EXPIRES_TIME)
      : 0;
    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      expires: expiresIn,
    });
    res.status(200).json({ refreshToken, success: true });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized  !!!", error });
  }
};

// logout
const postLogout = async (req, res, next) => {
  try {
    let access_token = null;
    if (express().get("env") === "production") access_token = req.body.token;
    else access_token = req.cookies.access_token;
    const decoded = await jwt.verify(access_token, process.env.JWT_SECRET_KEY);
    const { accountId } = decoded.sub;
    //remove refresh token
    await AccountModel.updateOne({ _id: accountId }, { refreshToken: null });
    //clear cookie client
    res.clearCookie("access_token");
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    return res.status(409).json({ message: "failed" });
  }
};

// api: lấy danh sách người dùng bao gồm admin và customer
const getCustomerList = async (req, res, next) => {
  try {
    const list = await UserModel.aggregate([
      {
        $lookup: {
          from: "accounts",
          localField: "accountId",
          foreignField: "_id",
          as: "fromItems",
        },
      },

      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{ $arrayElemAt: ["$fromItems", 0] }, "$$ROOT"],
          },
        },
      },
      { $project: { fromItems: 0 } },
    ]);

    return res.status(200).json({ list });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ list: [] });
  }
};

// api: Cập nhật admin
const updateAccountAdmin = async (req, res, next) => {
  try {
    const account = req.body;
    const { _id, fullName, userName, avt, phone, birthday, gender, isActive } =
      account;

    const customer = await UserModel.findById(_id);

    if (customer) {
      await AccountModel.updateOne(
        { _id: customer.accountId },
        {
          $set: { isActive },
          $currentDate: { lastModified: true },
        }
      );
      await UserModel.updateOne(
        { _id: _id },
        {
          $set: { fullName, userName, phone, avt, birthday, gender },
          $currentDate: { lastModified: true },
        }
      );
      return res.status(200).json({});
    }
  } catch (error) {
    console.error(error);
    return res.status(409).json({ message: "failed" });
  }
};

// api: Cập nhật khách hàng
const updateAccountCustomer = async (req, res, next) => {
  try {
    const account = req.body;
    const { _id, isActive } = account;
    const customer = await UserModel.findById(_id);

    if (customer) {
      await AccountModel.updateOne(
        { _id: customer.accountId },
        {
          $set: { isActive },
          $currentDate: { lastModified: true },
        }
      );
      return res.status(200).json({});
    }
  } catch (error) {
    console.error(error);
    return res.status(409).json({ message: "failed" });
  }
};

// api: xoá 1 người dùng
const delCustomer = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const customer = await UserModel.findById(userId);
    if (customer) {
      await AccountModel.deleteOne({ _id: customer.accountId });
      await UserModel.deleteOne({ _id: userId });
      return res.status(200).json({});
    }
  } catch (error) {
    return res.status(409).json({});
  }
};

module.exports = {
  postAddAdmin,
  postLogin,
  postRefreshToken,
  getAuth,
  getUser,
  postLogout,
  getCustomerList,
  updateAccountAdmin,
  updateAccountCustomer,
  delCustomer,
};
