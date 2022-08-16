const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sliderSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },

    title: { type: String, required: true, trim: true },

    description: { type: String, trim: true, required: true },

    image: { required: true, type: String, trim: true },

    path: { required: true, type: String, trim: true },

    color: { type: Number, required: true },

    status: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
  }
);



const SliderModel = mongoose.model("slider", sliderSchema, "sliders");

module.exports = SliderModel;
