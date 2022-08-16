const sliderApi = require("express").Router();
const sliderController = require("../controllers/slider");

// api: lấy danh sách đơn hàng
sliderApi.get("/", sliderController.getSliderList);

module.exports = sliderApi;
