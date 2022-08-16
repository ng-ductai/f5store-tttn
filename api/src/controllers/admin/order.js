const ProductModel = require("../../models/product/product");
const helpers = require("../../helpers");
const UserModel = require("../../models/account/user");
const AccountModel = require("../../models/account/account");
const OrderModel = require("../../models/order");
const mailConfig = require("../../configs/mail");

// api: lấy danh sách đơn hàng
const getOrderList = async (req, res, next) => {
  try {
    const list = await OrderModel.find({}).select(" -note");
    return res.status(200).json({ list });
  } catch (error) {
    console.error(error);
    return res.status(401).json({});
  }
};

// api: cập nhật trạng thái đơn hàng
const postUpdateOrderStatus = async (req, res, next) => {
  try {
    const { id, orderStatus } = req.body;
    const response = await OrderModel.updateOne(
      { _id: id },
      { $set: { orderStatus }, $currentDate: { lastModified: true } }
    );

    if (orderStatus === 1) {
      const order = await OrderModel.findById(id).select("-_id");

      if (order) {
        const {
          deliveryAdd,
          orderDate,
          productList,
          paymentMethod,
          transportFee,
          transportMethod,
          orderCode,
          owner,
          note,
        } = order;

        const user = await UserModel.findById(owner).select("-_id");
        const { accountId, fullName } = user;

        const account = await AccountModel.findById(accountId).select("-_id");
        const { email } = account;

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
          subject: `Xác nhận đơn hàng #${orderCode}`,
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
        const result = await mailConfig.sendEmail(mail);
      }
    }

    if (orderStatus === 5) {
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
  postUpdateOrderStatus,
};
