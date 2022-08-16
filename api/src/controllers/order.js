const OrderModel = require("../models/order");
const helpers = require("../helpers");
const ProductModel = require("../models/product/product");
const mailConfig = require("../configs/mail");

// api: tạo 1 đơn hàng (tách nhiều sản phẩm ra mỗi sp 1 đơn)
const postCreateOrder = async (req, res, next) => {
  try {
    const data = req.body;
    const {
      owner,
      deliveryAdd,
      paymentMethod,
      orderStatus,
      transportMethod,
      transportFee,
      orderDate,
      productList,
      note,
      email,
      fullName,
    } = data;

    let response = {};
    for (let i = 0; i < productList.length; ++i) {
      const { orderProd } = productList[i];
      const product = await ProductModel.findById(orderProd.id);
      if (product) {
        if (product.stock < parseInt(orderProd.amount)) {
          return res.status(401).json({ message: "Sản phẩm tồn kho đã hết" });
        } else {
          await ProductModel.updateOne(
            { _id: orderProd.id },
            {
              stock: parseInt(product.stock) - parseInt(orderProd.amount),
              sold: parseInt(product.sold) + parseInt(orderProd.amount),
            }
          );
        }
      } else {
        return res.status(401).json({ message: "Sản phẩm đã ngừng bán" });
      }
    }

    response = await OrderModel.create({
      owner,
      orderCode: helpers.generateVerifyCode(6),
      deliveryAdd,
      paymentMethod,
      orderStatus,
      transportMethod,
      transportFee,
      orderDate,
      productList,
      note,
    });

    /*     console.log("resfff", response);

    const { name, phone, address } = deliveryAdd;
    const addressStr = await helpers.convertAddress(address);

    const orderProd = productList.map((item, index) => {
      return {
        key: index + 1,
        amount: item.orderProd.amount,
        price: item.orderProd.price,
        discount: item.orderProd.discount,
        name: item.orderProd.name,
        avt: item.orderProd.avt,
        id: item.orderProd.id,
      };
    });

    console.log(" orderProd", orderProd);
    const temp_Money = productList
      .map((item, index) => {
        return {
          key: index + 1,
          total: item.orderProd.amount * item.orderProd.price,
        };
      })
      .reduce((total, money) => {
        return (total += money.total);
      }, 0);

    const total_Money = temp_Money + transportFee;

    const mail = {
      to: email,
      subject: "Xác nhận đơn hàng",
      html: mailConfig.htmlOrder(
        fullName,
        name,
        phone,
        addressStr,
        helpers.convertPaymentMethod(paymentMethod),
        helpers.convertTransportMethod(transportMethod),
        helpers.formatProductPrice(transportFee),
        helpers.formatOrderDate(orderDate),
        helpers.formatProductPrice(temp_Money),
        helpers.formatProductPrice(total_Money),
        orderProd,
        note
      ),
    };

    //gửi mail
    const result = await mailConfig.sendEmail(mail); */

    if (response) return res.status(200).json({});
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Lỗi hệ thống" });
  }
};

// api: lấy danh sách đơn hàng user
const getOrderList = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const orderList = await OrderModel.find({ owner: userId }).select(
      "-owner -deliveryAdd  -note"
    );
    if (orderList) {
      return res.status(200).json({ list: orderList });
    }
    return res.status(200).json({ list: [] });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ list: [] });
  }
};

// api: lấy chi tiết 1 đơn hàng
const getOrderDetails = async (req, res, next) => {
  try {
    const { orderId } = req.query;

    const order = await OrderModel.findById(orderId).select("-_id -owner");
    if (order) {
      const { deliveryAdd } = order;
      const { name, phone, address } = deliveryAdd;
      const addressStr = await helpers.convertAddress(address);
      let newOrder = {
        ...order._doc,
        deliveryAdd: { name, phone, address: addressStr },
      };

      return res.status(200).json({ order: newOrder });
    }
    return res.status(400).json({});
  } catch (error) {
    console.error(error);
    return res.status(400).json({});
  }
};

// api: cập nhật trạng thái đơn hàng
const postCancelOrder = async (req, res, next) => {
  try {
    const { id, orderStatus } = req.body;
    const response = await OrderModel.updateOne(
      { _id: id },
      { $set: { orderStatus }, $currentDate: { lastModified: true } }
    );

    if (orderStatus) {
      const order = await OrderModel.findById(id).select("-_id");

      if (order) {
        const { productList } = order;

        for (let i = 0; i < productList.length; ++i) {
          const { orderProd } = productList[i];
          const product = await ProductModel.findById(orderProd.id);

          if (product) {
            await ProductModel.updateOne(
              { _id: orderProd.id },
              {
                $set: {
                  stock: parseInt(product.stock) + parseInt(orderProd.amount),
                  sold: parseInt(product.sold) - parseInt(orderProd.amount),
                },
                $currentDate: { lastModified: true },
              }
            );
          } else {
            return res.status(401).json({
              message:
                "Sản phẩm đã ngừng bán, không cập nhật số lượng tồn và đã bán",
            });
          }
        }
      }
    }

    if (response) return res.status(200).json({});
  } catch (error) {
    return res.status(401).json({});
  }
};

module.exports = {
  getOrderList,
  getOrderDetails,
  postCreateOrder,
  postCancelOrder,
};
