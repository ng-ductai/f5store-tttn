const orderApi = require('express').Router();
const orderController = require('../controllers/order');

// api: lấy danh sách đơn hàng
orderApi.get('/list', orderController.getOrderList);

// api: lấy chi tiết 1 đơn hàng
orderApi.get('/', orderController.getOrderDetails);

// api: tạo 1 đơn hàng 
orderApi.post('/', orderController.postCreateOrder);

// api: hủy đơn hàng
orderApi.post("/update", orderController.postCancelOrder);

module.exports = orderApi;
