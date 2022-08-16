const sliderAdminApi = require("express").Router();
const adminController = require("../../controllers/admin/slider");

// lấy danh sách slide
sliderAdminApi.get("/slider", adminController.getSliderList);

// cập nhật 1 slide
sliderAdminApi.put("/slider/update", adminController.updateSlider);

// thêm 1 slide
sliderAdminApi.post("/slider/add", adminController.addSlider);

// api: xoá 1 slide
sliderAdminApi.delete("/slider/del", adminController.delSlider);

module.exports = sliderAdminApi;
