const statisticApi = require('express').Router();
const statisticController = require('../controllers/statistic');

// api: thống kê doanh thu theo tháng
statisticApi.get('/monthly-revenue', statisticController.getStaMonthlyRevenue);

// api: thống kê doanh thu theo năm
statisticApi.get('/annual-revenue', statisticController.getStaAnnualRevenue);

// api: thống kê đơn hàng tỉnh nào nhiều nhất
statisticApi.get('/top-order', statisticController.getTopProvinceOrder);

// api: thống kê tổng doanh thu 
statisticApi.get('/total-revenue', statisticController.getTotalRevenue);

module.exports = statisticApi;
