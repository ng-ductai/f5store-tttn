const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const headphoneSchema = new Schema({
  // _id sản phẩm bên ProductModel
  idProduct: { type: Schema.Types.ObjectId, ref: "product", required: true },

  // kiểu tai nghe 
  type: {
    type: Number,
    enum: [...Array(5).keys()],
    required: true,
    default: 0,
  },

  // chuẩn kết nối
  // 0 - 3.5mm, 1 - bluetooth, 2 - USB, 3 - Bluetooth 4.0, 4 - bluetooth 5.0, 5 - 2.4 GHz Wireless
  connectionStd: { type: Number, enum: [...Array(5).keys()], default: 0 },

  //kiểu sạc
  charger : { type: Number, enum: [...Array(4).keys()], default: 0  },

  // thời gian bảo hành tính theo tháng
  warranty: { type: Number, default: 0 },

  //màu tai nghe
  color: { type: Number, required: true },

  // các hình ảnh của sản phẩm
  catalogs: [String],

  // bài viết mô tả chi tiết ở DescriptionModel
  details: Schema.Types.ObjectId,
});

const HeadphoneModel = mongoose.model(
  "headphone",
  headphoneSchema,
  "headphones"
);

module.exports = HeadphoneModel;
