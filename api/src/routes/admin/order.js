const orderAdminApi = require("express").Router();
const adminController = require("../../controllers/admin/order");

// api: lấy danh sách đơn hàng
orderAdminApi.get("/order", adminController.getOrderList);

// api: cập nhật trạng thái đơn hàng
orderAdminApi.post("/order", adminController.postUpdateOrderStatus);

module.exports = orderAdminApi;
