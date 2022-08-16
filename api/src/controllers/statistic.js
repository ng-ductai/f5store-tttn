const AddressModel = require("../models/address");
const OrderModel = require("../models/order");

// api: thống kê doanh thu theo tháng
const getStaMonthlyRevenue = async (req, res, next) => {
  try {
    const { year } = req.query;
    // lấy danh sách đơn hàng trong năm thống kê (Chỉ lấy đơn hàng đã thanh toán)
    const thisYearOrder = await OrderModel.find({
      orderDate: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      },
      orderStatus: 4,
    }).select("-_id orderDate  transportFee productList");

    // lấy danh sách đơn hàng năm trước đó
    const lastYearOrder = await OrderModel.find({
      orderDate: {
        $gte: new Date(`${parseInt(year) - 1}-01-01`),
        $lte: new Date(`${parseInt(year) - 1}-12-31`),
      },
      orderStatus: 4,
    }).select("-_id orderDate  transportFee productList");

    // kết quả sau thống kê
    let thisYear = [...Array(12).fill(0)],
      lastYear = [...Array(12).fill(0)];

    // thống kê
    if (thisYearOrder) {
      thisYearOrder.forEach((item) => {
        const month = new Date(item.orderDate).getMonth();
        const totalMoney = item.productList
          .map((i, index) => {
            return {
              key: index + 1,
              total: i.orderProd.amount * i.orderProd.price,
            };
          })
          .reduce((total, money) => {
            return (total += money.total);
          }, item.transportFee);
        thisYear[month] += totalMoney;
      });
    }
    if (lastYearOrder) {
      lastYearOrder.forEach((item) => {
        const month = new Date(item.orderDate).getMonth();
        const totalMoney = item.productList
          .map((i, index) => {
            return {
              key: index + 1,
              total: i.orderProd.amount * i.orderProd.price,
            };
          })
          .reduce((total, money) => {
            return (total += money.total);
          }, item.transportFee);
        lastYear[month] += totalMoney;
      });
    }

    if (thisYearOrder && lastYearOrder)
      return res.status(200).json({ thisYear, lastYear });
  } catch (error) {
    console.error(error);
    return res.status(400).json({});
  }
};

// api: thống kê doanh thu theo năm
const getStaAnnualRevenue = async (req, res, next) => {
  try {
    const { startYear, endYear } = req.query;
    // lấy danh sách đơn hàng trong năm thống kê (Chỉ lấy đơn hàng đã thanh toán)
    const orderList = await OrderModel.find({
      orderDate: {
        $gte: new Date(`${startYear}-01-01`),
        $lte: new Date(`${endYear}-12-31`),
      },
      orderStatus: 4,
    }).select("-_id orderDate  transportFee productList");

    let result = [
      ...Array(parseInt(endYear) + 1 - parseInt(startYear)).fill(0),
    ];

    if (orderList) {
      orderList.forEach((item) => {
        const resIndex =
          parseInt(endYear) - new Date(item.orderDate).getFullYear();
        const totalMoney = item.productList
          .map((i, index) => {
            return {
              key: index + 1,
              total: i.orderProd.amount * i.orderProd.price,
            };
          })
          .reduce((total, money) => {
            return (total += money.total);
          }, item.transportFee);
        result[resIndex] += totalMoney;
      });
    }
    if (orderList) return res.status(200).json({ data: result });
  } catch (error) {
    console.error(error);
    return res.status(400).json({});
  }
};

// api: thống kê doanh thu theo năm
const getTotalRevenue = async (req, res, next) => {
  try {
    const orderList = await OrderModel.find({
      orderStatus: 4,
    }).select("-_id orderDate  transportFee productList");

   
    let result = 0;
    if (orderList) {
      orderList.forEach((item) => {
        const totalMoney = item.productList
          .map((i, index) => {
            return {
              key: index + 1,
              total: i.orderProd.amount * i.orderProd.price,
            };
          })
          .reduce((total, money) => {
            return (total += money.total);
          }, item.transportFee);
        result += totalMoney;
      });
    }
    if (orderList) return res.status(200).json({ data: result });
  } catch (error) {
    console.error(error);
    return res.status(400).json({});
  }
};

// api: thống kê đơn hàng tỉnh nào nhiều nhất
const getTopProvinceOrder = async (req, res, next) => {
  try {
    // lấy danh sách top 5 đơn hàng trong các tinh
    const topList = await OrderModel.aggregate([
      { $match: { orderStatus: 4 } },
      {
        $group: {
          _id: "$deliveryAdd.address.province",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    if (topList) {
      let result = [];
      for (let i = 0; i < topList.length; ++i) {
        const province = await AddressModel.findOne({
          id: topList[i]._id,
        }).select("-_id name");

        if (province)
          result.push({ province: province.name, count: topList[i].count });
      }

      return res.status(200).json({ data: result });
    }
  } catch (error) {
    return res.status(401).json({ data: [] });
  }
};

module.exports = {
  getStaMonthlyRevenue,
  getStaAnnualRevenue,
  getTopProvinceOrder,
  getTotalRevenue,
};
