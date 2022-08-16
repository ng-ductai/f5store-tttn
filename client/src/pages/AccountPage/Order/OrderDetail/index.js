import { Col, Modal, Row, Spin, Table } from "antd";
import orderApi from "../../../../apis/orderApi";
import {
  formatProductPrice,
  formatDate,
  convertOrderStatus,
  convertPaymentMethod,
  convertTransportMethod,
  calTotalOrderFee,
} from "../../../../helpers";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const OrderDetail = (props) => {
  const { orderId, onClose } = props;
  const [visible, setVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState(null);

  // lấy chi tiết đơn hàng
  useEffect(() => {
    let isSubscribe = true;
    const getOrderDetails = async () => {
      try {
        const response = await orderApi.getOrderDetails(orderId);
        if (isSubscribe && response) {
          const list = response.data.order;
          console.log("detail1", list);

          setOrder({
            transportFee: list.transportFee,
            orderCode: list.orderCode,
            orderDate: list.orderDate,
            deliveryAdd: list.deliveryAdd,
            orderProd: list.productList.map((item, index) => {
              return {
                key: index + 1,
                amount: item.orderProd.amount,
                price: item.orderProd.price,
                discount: item.orderProd.discount,
                name: item.orderProd.name,
                avt: item.orderProd.avt,
                id: item.orderProd.id,
              };
            }),
            note: list.note,

            orderStatus: list.orderStatus,
            total_Money: list.productList
              .map((item, index) => {
                return {
                  key: index + 1,
                  total: item.orderProd.amount * item.orderProd.price,
                };
              })
              .reduce((total, money) => {
                return (total += money.total);
              }, 0),
          });
          setIsLoading(false);
        }
      } catch (error) {
        if (isSubscribe) {
          setIsLoading(false);
          setOrder(null);
        }
      }
    };
    getOrderDetails();
    return () => {
      isSubscribe = false;
    };
  }, [orderId]);

  // cột cho bảng chi tiết sản phẩm
  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      width: 50,
    },
    {
      title: "Sản phẩm",
      dataIndex: "prod",
      key: "prod",
      width: 450,
      render: (v, record) => (
        <Link to={`/product/${record.id}`}>
          <div className="d-flex align-i-center">
            <img style={{ width: 70 }} src={record.avt} alt="" />
            <div className="p-l-14 font-size-17px">
              <p className="nameProduct"> {record.name}</p>
            </div>
          </div>
        </Link>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      align: "center",
      key: "prod",
      render: (v, record) => (
        <p className="font-size-16px">{formatProductPrice(record.price)}</p>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (v, record) => <p className="font-size-16px">{record.amount} </p>,
    },

    {
      title: "Thành tiền",
      dataIndex: "total",
      key: "total",
      align: "center",
      render: (v, record) => {
        const { price, amount } = record;
        return (
          <p className="font-size-16px">{formatProductPrice(price * amount)}</p>
        );
      },
    },
  ];

  return (
    <Modal
      width={1000}
      centered
      visible={visible}
      onCancel={() => {
        setVisible(false);
        onClose();
      }}
      maskClosable={false}
      footer={null}
      title={
        <p className="font-size-20px m-b-0">
          Chi tiết đơn hàng
          {order && (
            <>
              <span style={{ color: "#4670FF" }}>{` #${order.orderCode}`}</span>
              <b>{` - ${convertOrderStatus(order.orderStatus)}`}</b>
            </>
          )}
        </p>
      }
    >
      <>
        {isLoading ? (
          <div className="pos-relative" style={{ minHeight: 180 }}>
            <Spin
              className="trans-center"
              tip="Đang tải chi tiết đơn hàng..."
              size="large"
            />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {/* địa chỉ người nhận */}
            <Col span={12}>
              <div className=" p-lr-12 d-flex justify-content-start flex-direction-column">
                <div className="d-flex font-weight-500 align-i-center m-b-8">
                  <p
                    className=" font-size-16px d-flex justify-content-end"
                    style={{ minWidth: 90 }}
                  >
                    Họ tên
                  </p>
                  <span className="m-l-20 font-size-16px">
                    {order.deliveryAdd.name}
                  </span>
                </div>

                <div className="d-flex font-weight-500 align-i-center m-b-8">
                  <p
                    className=" font-size-16px d-flex justify-content-end"
                    style={{ minWidth: 90 }}
                  >
                    Số điện thoại
                  </p>
                  <span className="m-l-20 font-size-16px">
                    {order.deliveryAdd.phone}
                  </span>
                </div>

                <div className="d-flex font-weight-500 align-i-center m-b-8">
                  <p
                    className=" font-size-16px d-flex justify-content-end"
                    style={{ minWidth: 90 }}
                  >
                    Địa chỉ
                  </p>
                  <span className="m-l-20 font-size-16px">
                    {order.deliveryAdd.address}
                  </span>
                </div>
              </div>
            </Col>

            {/* Hình thức thanh toán */}
            <Col span={12}>
              <div className=" p-lr-12 d-flex justify-content-start flex-direction-column">
                <div className="d-flex font-weight-500 align-i-center m-b-8">
                  <p
                    className=" font-size-16px d-flex justify-content-end"
                    style={{ minWidth: 160 }}
                  >
                    Ngày đặt hàng
                  </p>
                  <span className="m-l-20 font-size-16px">
                    {formatDate(order.orderDate, 1)}
                  </span>
                </div>
                <div className="d-flex font-weight-500 align-i-center m-b-8">
                  <p
                    className=" font-size-16px d-flex justify-content-end"
                    style={{ minWidth: 160 }}
                  >
                    Đơn vị vận chuyển
                  </p>
                  <span className="m-l-20 font-size-16px">
                    {convertTransportMethod(order.transportMethod)}
                  </span>
                </div>
                <div className="d-flex font-weight-500 align-i-center m-b-8">
                  <p
                    className=" font-size-16px d-flex justify-content-end"
                    style={{ minWidth: 160 }}
                  >
                    Phương thức thanh toán
                  </p>
                  <span className="m-l-20 font-size-16px">
                    {convertPaymentMethod(order.paymentMethod)}
                  </span>
                </div>
              </div>
            </Col>

            {/* Chi tiết sản phẩm đã mua */}
            <Col span={24}>
              <Table
                pagination={false}
                columns={columns}
                dataSource={order.orderProd}
              />
            </Col>

            {/* Tổng cộng */}
            <Col span={24} className="t-right p-r-40">
              <div className="d-flex font-weight-500 justify-content-end font-size-16px m-b-8">
                <p style={{ color: "#333" }}>Tạm tính</p>
                <span
                  className="m-l-24"
                  style={{ color: "#555", minWidth: 180 }}
                >
                  {formatProductPrice(order.total_Money)}
                </span>
              </div>
              <div className="d-flex font-weight-500 justify-content-end font-size-16px m-b-8">
                <p style={{ color: "#333" }}>Phí vận chuyển</p>
                <span
                  className="m-l-24"
                  style={{ color: "#555", minWidth: 180 }}
                >
                  {formatProductPrice(order.transportFee)}
                </span>
              </div>
              <div className="d-flex font-weight-500 justify-content-end font-size-16px m-b-8">
                <p style={{ color: "#333" }}>Tổng cộng</p>
                <span
                  className="m-l-24 font-size-20px"
                  style={{ color: "#ff2000", minWidth: 180 }}
                >
                  {formatProductPrice(calTotalOrderFee(order))}
                </span>
              </div>
            </Col>
          </Row>
        )}
      </>
    </Modal>
  );
};

OrderDetail.propTypes = {
  orderId: PropTypes.string,
  onClose: PropTypes.func,
};

export default OrderDetail;
