const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    // id liên kết với account của user này
    accountId: { type: Schema.Types.ObjectId, required: true, ref: "account" },
    fullName: {
      type: String,
      trim: true,
      required: true,
      default: "User Name",
    },
    birthday: { type: String, default: "1970-01-01" },
    userName: { type: String, trim: true, required: true, default: "user" },
    gender: { type: Boolean, required: true, default: true },
    avt: {
      type: String,
      required: true,
      trim: true,
      default:
        "https://res.cloudinary.com/ductai2982/image/upload/v1655193025/users/slider/default-avt_loae7k.png",
    },
    phone: { type: String },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("user", userSchema, "users");

module.exports = UserModel;
