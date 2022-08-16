import React, { useEffect, useState } from "react";
import { Button, message, Modal, Radio, Spin, Table, Col } from "antd";
import { RightOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import adminApi from "../../apis/adminApi";
import {
  reduceProductName,
  formatProductPrice,
  formatDate,
  convertOrderStatus,
} from "../../helpers";
import { Link } from "react-router-dom";
import OrderDetail from "./OrderDetail";
import Helmet from "../../components/Helmet";
import "./index.scss";

const generateFilterOrder = () => {
  let result = [];
  for (let i = 0; i < 6; ++i) {
    result.push({ value: i, text: convertOrderStatus(i) });
  }
  return result;
};

const OrderList = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState({
    orderId: "",
    isOpen: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Cập nhật trạng thái đơn hàng
  const updateOrderStatus = async (id, orderStatus) => {
    try {
      const response = await adminApi.postUpdateOrderStatus(id, orderStatus);
      if (response) {
        message.success("Cập nhật thành công");
        setData(
          data.map((item) =>
            item.orderId === id ? { ...item, orderStatus } : { ...item }
          )
        );
      }
    } catch (error) {
      message.success("Cập nhật thất bại");
    }
  };

  // modal cập nhật trạng thái đơn hàng
  const UpdateOrderStatusModal = (defaultVal = 0, orderCode, orderId) => {
    let valueCurr = defaultVal;
    const modal = Modal.info({
      celText: "Cancel",
      onCancel: () => {},
      width: 768,
      title: (
        <h3 className="font-size-22px t-center font-weight-600">
          Cập nhật trạng thái cho đơn hàng <b>#{orderCode} </b>
        </h3>
      ),
      content: (
        <Radio.Group
          defaultValue={defaultVal}
          onChange={(v) => (valueCurr = v.target.value)}
          className="m-t-12"
        >
          {generateFilterOrder().map((item, index) => (
            <Radio
              className="m-b-8 font-size-18px"
              key={index}
              value={item.value}
            >
              {item.text}
            </Radio>
          ))}
        </Radio.Group>
      ),
      centered: true,
      icon: null,
      okText: "Cập nhật",
      onOk: () => {
        updateOrderStatus(orderId, valueCurr);
        modal.destroy();
      },
      closable: true,
    });
  };

  const columns = [
    {
      title: "STT",
      key: "key",
      align: "center",
      dataIndex: "key",
    },
    {
      align: "center",
      title: "Mã đơn hàng",
      key: "orderCode",
      dataIndex: "orderCode",
      render: (orderCode, records) => (
        <Button
          type="link"
          onClick={() =>
            setOrderDetails({ isOpen: true, orderId: records.orderId })
          }
        >
          {orderCode}
        </Button>
      ),
    },
    {
      title: "Ngày đặt",
      align: "center",
      key: "orderDate",
      dataIndex: "orderDate",
      sorter: (a, b) => {
        if (a.orderDate > b.orderDate) return 1;
        if (a.orderDate < b.orderDate) return -1;
        return 0;
      },
    },
    {
      title: "Khách hàng",
      align: "center",
      key: "nameDeliver",
      dataIndex: "nameDeliver",
      render: (nameDeliver) => reduceProductName(nameDeliver, 30),
    },
    {
      title: "Số điện thoại",
      align: "center",
      key: "phoneDeliver",
      dataIndex: "phoneDeliver",
      render: (phoneDeliver) => reduceProductName(phoneDeliver, 30),
    },
    {
      title: "Tổng tiền",
      align: "right",
      key: "totalMoney",
      dataIndex: "totalMoney",
      render: (value) => <p>{formatProductPrice(value)}</p>,
      sorter: (a, b) => a.totalMoney - b.totalMoney,
    },
    {
      title: "Trạng thái",
      align: "center",
      key: "orderStatus",
      dataIndex: "orderStatus",
      filters: generateFilterOrder(),
      onFilter: (value, record) => record.orderStatus === value,
      render: (value) => (
        <div>
          {value === 3 && (
            <p className="order_status-pending">{convertOrderStatus(value)}</p>
          )}

          {value === 4 && (
            <p className="order_status-success">{convertOrderStatus(value)}</p>
          )}

          {value === 5 && (
            <p className="order_status-cancel"> {convertOrderStatus(value)}</p>
          )}

          {value !== 5 &&
            value !== 4 &&
            value !== 3 &&
            convertOrderStatus(value)}
        </div>
      ),
    },
    {
      title: "Thao tác",
      align: "center",
      width: 160,
      render: (_v, records) => (
        <div className="action">
          {records.orderStatus !== 5 && records.orderStatus !== 4 ? (
            <>
              <EyeOutlined
                onClick={() =>
                  setOrderDetails({ isOpen: true, orderId: records.orderId })
                }
                className="m-r-12  font-size-20px"
                style={{
                  color: "#4267b2",
                }}
              />

              <EditOutlined
                className="font-size-20px"
                style={{
                  color: "rgb(25, 255, 0)",
                }}
                onClick={() =>
                  UpdateOrderStatusModal(
                    records.orderStatus,
                    records.orderCode,
                    records.orderId
                  )
                }
              />
            </>
          ) : (
            <>
              <EyeOutlined
                onClick={() =>
                  setOrderDetails({ isOpen: true, orderId: records.orderId })
                }
                className="font-size-20px"
                style={{
                  color: "#4267b2",
                }}
              />
            </>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    let isSubscribe = true;
    const getOrderList = async () => {
      try {
        setIsLoading(true);
        const response = await adminApi.getOrderList();
        if (isSubscribe && response) {
          const list = response.data.list.reverse();
          const newList = list.map((item, index) => {
            return {
              key: index + 1,
              orderId: item._id,
              owner: item.owner,
              orderCode: item.orderCode,
              orderDate: formatDate(item.orderDate),
              nameDeliver: item.deliveryAdd.name,
              phoneDeliver: item.deliveryAdd.phone,
              productList: item.productList.map((item, index) => {
                return {
                  key: index + 1,
                  amount: item.orderProd.amount,
                  price: item.orderProd.price,
                  discount: item.orderProd.discount,
                  name: item.orderProd.name,
                  avt: item.orderProd.avt,
                };
              }),
              transportFee: item.transportFee,
              paymentMethod: item.paymentMethod,
              orderStatus: item.orderStatus,
              totalMoney: item.productList
                .map((item, index) => {
                  return {
                    key: index + 1,
                    total: item.orderProd.amount * item.orderProd.price,
                  };
                })
                .reduce((total, money) => {
                  return (total += money.total);
                }, item.transportFee),
            };
          });
          setData([...newList]);
          setIsLoading(false);
        }
      } catch (error) {
        if (isSubscribe) setIsLoading(false);
      }
    };
    getOrderList();
    return () => {
      isSubscribe = false;
    };
  }, []);

  return (
    <Helmet title={"Quản lý đơn đặt hàng"}>
      <div className="orders">
        <Col span={24} className="p-tb-0">
          <div className="breadcrump">
            <Link to="/dashboard">
              <p className="breadcrump-homeback">Trang chủ</p>
            </Link>
            <span className="p-lr-8">
              <RightOutlined className="breadcrump-arrow" />
            </span>
            <span className="breadcrump-title">Đơn đặt hàng</span>
          </div>
        </Col>

        <div className="orders__title">
          <h2>QUẢN LÝ ĐƠN ĐẶT HÀNG</h2>
        </div>

        {isLoading ? (
          <Spin
            className="trans-center"
            tip="Đang lấy danh sách đơn hàng ..."
          />
        ) : (
          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              pageSize: 8,
              position: ["bottomCenter"],
              showSizeChanger: false,
            }}
          />
        )}
        {orderDetails.isOpen && (
          <OrderDetail
            orderId={orderDetails.orderId}
            onClose={() => setOrderDetails({ isOpen: false })}
          />
        )}
      </div>
    </Helmet>
  );
};

export default OrderList;
