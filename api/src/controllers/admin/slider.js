const { cloudinary } = require("../../configs/cloudinary");
const SliderModel = require("../../models/slider");

// upload product avatar to cloudinary
const uploadProductAvt = async (avtFile, productCode) => {
  try {
    const result = await cloudinary.uploader.upload(avtFile, {
      folder: `products/${productCode}`,
    });
    const { secure_url } = result;
    return secure_url;
  } catch (error) {
    throw error;
  }
};

// api: lấy danh sách slider
const getSliderList = async (req, res, next) => {
  try {
    const list = await SliderModel.find({}).select("-code");
    return res.status(200).json({ list });
  } catch (error) {
    console.error(error);
    return res.status(401).json({});
  }
};

//api: thêm slider
const addSlider = async (req, res, next) => {
  try {
    const { slider } = req.body;
    const { title, description, image, path, color, status } = slider;

    //Kiểm tra slide đã tồn tại hay chưa
    const slide = await SliderModel.findOne({ title });
    if (slide) return res.status(400).json({ message: error });

    const code = "id" + parseInt(Math.random().toString(9).substring(2, 7));
    const avtUrl = await uploadProductAvt(image, code);

    const newSlider = await SliderModel.create({
      code: code,
      title,
      description,
      image: avtUrl,
      path,
      color,
      status,
    });

    if (newSlider) return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(400).json({
      message: "Slider Creation Failed.",
      error,
    });
  }
};

// api: Cập nhật slider
const updateSlider = async (req, res, next) => {
  try {
    const account = req.body;
    const { _id, ...rest } = account;
    const result = await SliderModel.updateOne(
      { _id: _id },
      { $set: { ...rest }, $currentDate: { lastModified: true } }
    );
    if (result && result.ok === 1) {
      return res.status(200).json({ message: "success" });
    }
  } catch (error) {
    console.error(error);
    return res.status(409).json({ message: "failed" });
  }
};

// api: xoá 1 slider
const delSlider = async (req, res, next) => {
  try {
    const { slideId } = req.query;
    const slide = await SliderModel.findById(slideId);
    if (slide) {
      await SliderModel.deleteOne({ _id: slideId });
      return res.status(200).json({});
    }
  } catch (error) {
    return res.status(409).json({});
  }
};

module.exports = {
  addSlider,
  getSliderList,
  updateSlider,
  delSlider,
};
