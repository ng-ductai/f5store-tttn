const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const backupChargerSchema = new Schema({
  // _id sản phẩm bên ProductModel
  idProduct: { type: Schema.Types.ObjectId, ref: "product", required: true },

  // dung lượng tính theo mAh
  capacity: { type: Number, required: true },

  // lõi pin
  core: { type: Number, required: true },

  //time sạc
  time: { type: String, trim: true },

  //công nghệ sạc
  tech: { type: Number, required: true },

  // nguồn vào, vd '5V/1A'
  voltageIn: { type: String, trim: true },

  // nguồn ra, vd  '5V/1A, 2A'
  voltageOut: { type: String, trim: true },

  // màu của sạc
  color: { type: Number, required: true },

  // khối lượng tính theo g
  weight: { type: Number, default: 0 },

  // thời gian bảo hành tính theo tháng
  warranty: { type: Number, default: 0 },

  // các hình ảnh của sản phẩm
  catalogs: [String],

  // bài viết mô tả chi tiết ở DescriptionModel
  details: Schema.Types.ObjectId,
});

const BackupChargerModel = mongoose.model(
  "backupCharger",
  backupChargerSchema,
  "backupChargers"
);

module.exports = BackupChargerModel;
