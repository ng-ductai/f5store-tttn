const SliderModel = require("../models/slider");

// api: lấy danh sách slider
const getSliderList = async (req, res, next) => {
  try {
    const list = await SliderModel.find({ status: true }).select("-code -_id");
    return res.status(200).json({ list });
  } catch (error) {
    console.error(error);
    return res.status(401).json({});
  }
};

module.exports = {
  getSliderList,
};
