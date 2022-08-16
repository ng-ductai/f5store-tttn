const UserModel = require("../models/account/user");
const { cloudinary } = require("../configs/cloudinary");

// upload product avatar to cloudinary
const uploadProductAvt = async (avtFile, code) => {
  try {
    const result = await cloudinary.uploader.upload(avtFile, {
      folder: `users/${code}`,
    });
    const { secure_url } = result;
    return secure_url;
  } catch (error) {
    throw error;
  }
};

// api: get user
const getUser = async (req, res, next) => {
  try {
    if ((res.locals.isAuth = true)) {
      const { _id } = req.user;

      const infoUser = await UserModel.findOne({ accountId: _id }).populate({
        path: "accountId",
        select: "email _id password ",
      });

      //send information user
      const infoUserSend = {
        ...infoUser._doc,
        email: infoUser.accountId.email,
        password: infoUser.accountId.password,
        accountId: infoUser.accountId._id,
      };

      res.status(200).json({ user: infoUserSend });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Không thể lấy thông tin user !!!", error });
  }
};

// api: update user
const putUpdateUser = async (req, res, next) => {
  try {
    const { userId, value } = req.body;
    const avtUrl = value.avt;
    const code = value.userName;
    const avtU = await uploadProductAvt(avtUrl, code);
    value.avt = avtU;

    if (await UserModel.exists({ _id: userId })) {
      const response = await UserModel.updateOne(
        { _id: userId },
        {
          $set: { ...value },
          $currentDate: { lastModified: true },
        }
      );
      if (response) {
        return res.status(200).json({ message: "success" });
      }
    } else {
      return res.status(409).json({ message: "Tài khoản không tồn tại" });
    }
  } catch (error) {
    return res.status(409).json({ message: "Cập nhật thất bại" });
  }
};

//export
module.exports = {
  getUser,
  putUpdateUser,
};
