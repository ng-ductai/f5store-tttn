const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mobileSchema = new Schema({
  idProduct: { type: Schema.Types.ObjectId, ref: "product", required: true },
  cpu: { type: String, trim: true },
  resolution: { type: String, trim: true },
  cameras: {
    before: { type: String, trim: true },
    after: { type: String, trim: true },
  },
  color: { type: Number, required: true },
  displaySize: { type: String, trim: true },
  operating: { type: String, trim: true },
  rom: { type: Number, required: true },
  ram: { type: Number, required: true },
  pin: { type: String, trim: true },
  warranty: { type: Number, default: 0 },
  catalogs: [String],
  details: Schema.Types.ObjectId,
});

const MobileModel = mongoose.model("mobile", mobileSchema, "mobiles");

module.exports = MobileModel;
