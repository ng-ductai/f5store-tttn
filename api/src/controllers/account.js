const AccountModel = require("../models/account/account");
const VerifyModel = require("../models/account/verify");
const UserModel = require("../models/account/user");
const mailConfig = require("../configs/mail");
const helper = require("../helpers");
const constants = require("../constants");
const bcrypt = require("bcryptjs");

// USER //
// Gửi mã xác thực để đăng ký
const postSendVerifyCode = async (req, res) => {
  try {
    const { email } = req.body;
    //Kiểm tra tài khoản đã tồn tại hay chưa
    const account = await AccountModel.findOne({ email });

    //nếu tồn tại, thông báo lỗi, return
    if (account) {
      let suffixError =
        account.authType === "local"
          ? ""
          : `bởi đăng nhập với ${account.authType}`;
      let error = `Email đã được sử dụng ${suffixError} !`;
      return res.status(400).json({ message: error });
    }

    //cấu hình email sẽ gửi
    const verifyCode = helper.generateVerifyCode(constants.NUMBER_VERIFY_CODE);
    const mail = {
      to: email,
      subject: "Mã xác thực tạo tài khoản",
      html: mailConfig.htmlSignupAccount(verifyCode),
    };

    //lưu mã vào database để xác thực sau này
    await VerifyModel.findOneAndDelete({ email });
    await VerifyModel.create({
      code: verifyCode,
      email,
      dateCreated: Date.now(),
    });

    //gửi mail
    const result = await mailConfig.sendEmail(mail);

    //if success
    if (result) {
      return res.status(200).json({ message: "success" });
    }
  } catch (error) {
    return res.status(400).json({
      message: "Gửi mã thất bại",
      error,
    });
  }
};

// Đăng ký tài khoản
const postSignUp = async (req, res, next) => {
  try {
    const { email, verifyCode, password } = req.body.account;

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

    // kiểm tra mã xác thực
    const isVerify = await helper.isVerifyEmail(email, verifyCode);
    if (!isVerify) {
      return res.status(400).json({ message: "Mã xác nhận không hợp lệ !" });
    }

    // Tạo tạo tài khoản và user tương ứng
    const newAcc = await AccountModel.create({
      email,
      password,
      authType: "local",
      role: "0",
      isActive: true,
    });

    if (newAcc) {
      await UserModel.create({
        accountId: newAcc._id,
      });
      // xoá mã xác nhận
      await VerifyModel.deleteOne({ email });
    }
    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(400).json({
      message: "Account Creation Failed.",
      error,
    });
  }
};

//Gửi mã xác thực để lấy lại mật khẩu
const postSendCodeForgotPW = async (req, res, next) => {
  try {
    const { email } = req.body;
    //Kiểm tra tài khoản đã tồn tại hay chưa
    const account = await AccountModel.findOne({ email });

    //nếu tồn tại, thông báo lỗi, return
    if (!account)
      return res.status(406).json({ message: "Tài khoản không tồn tại" });

    //cấu hình email sẽ gửi
    const verifyCode = helper.generateVerifyCode(constants.NUMBER_VERIFY_CODE);
    const mail = {
      to: email,
      subject: "Thay đổi mật khẩu",
      html: mailConfig.htmlResetPassword(verifyCode),
    };

    //lưu mã vào database để xác thực sau này
    await VerifyModel.findOneAndDelete({ email });
    await VerifyModel.create({
      code: verifyCode,
      email,
      dateCreated: Date.now(),
    });

    //gửi mail
    const result = await mailConfig.sendEmail(mail);

    //if success
    if (result) {
      return res.status(200).json({ message: "success" });
    }
  } catch (error) {
    return res.status(409).json({
      message: "Gửi mã thấy bại",
      error,
    });
  }
};

// api: update user
const putUpdatePassword = async (req, res, next) => {
  try {
    const { accountId, value } = req.body;
    const { oldPassword, newPassword } = value;

    if (await AccountModel.exists({ _id: accountId })) {
      const acc = await AccountModel.findById(accountId).select("-_id");
      const isMatch = await bcrypt.compare(oldPassword, acc.password);
      if (isMatch) {
        const hashNewPassword = await bcrypt.hash(
          newPassword,
          parseInt(process.env.SALT_ROUND)
        );

        const response = await AccountModel.updateOne(
          { _id: accountId },
          {
            $set: { password: hashNewPassword },
            $currentDate: { lastModified: true },
          }
        );

        if (response) {
          return res.status(200).json({ message: "success" });
        }
      } else {
        return res.status(409).json({ message: "Mật khẩu không đúng" });
      }
    } else {
      return res.status(409).json({ message: "Tài khoản không tồn tại" });
    }
  } catch (error) {
    return res.status(409).json({ message: "Cập nhật thất bại" });
  }
};

//reset password
const postResetPassword = async (req, res, next) => {
  try {
    const { email, password, verifyCode } = req.body.account;

    // kiểm tra mã xác thực
    const isVerify = await helper.isVerifyEmail(email, verifyCode);
    if (!isVerify) {
      return res.status(401).json({ message: "Mã xác nhận không hợp lệ." });
    }

    //check userName -> hash new password -> change password
    const hashPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUND)
    );

    const response = await AccountModel.updateOne(
      { email, authType: "local" },
      { password: hashPassword, failedLoginTimes: 0 }
    );

    //check response -> return client
    if (response.n) {
      //xoá mã xác nhận
      await VerifyModel.deleteOne({ email });
      return res.status(200).json({ message: "Thay đổi mật khẩu thành công" });
    } else {
      return res.status(409).json({ message: "Thay đổi mật khẩu thất bại" });
    }
  } catch (error) {
    return res.status(409).json({ message: "Thay đổi mật khẩu thất bại" });
  }
};
module.exports = {
  postSendVerifyCode,
  postSignUp,
  postSendCodeForgotPW,
  postResetPassword,
  putUpdatePassword,
};
