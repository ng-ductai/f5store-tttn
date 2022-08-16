import React, { useEffect, useState } from "react";
import { Button, Spin, Table, message, Modal } from "antd";
import orderApi from "../../../apis/orderApi";
import {
  formatProductPrice,
  formatOrderDate,
  convertOrderStatus,
  calTotalOrderFee,
} from "../../../helpers";
import { useSelector } from "react-redux";
import OrderDetail from "./OrderDetail";

// tạo danh sách lọc cho trạng thái đơn hàng
const generateOrderStaFilter = () => {
  let result = [];
  for (let i = 0; i < 6; ++i) {
    result.push({ value: i, text: convertOrderStatus(i) });
  }
  return result;
};

const Order = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orderList, setOrderList] = useState([]);
  const user = useSelector((state) => state.user);
  const [orderDetails, setOrderDetails] = useState({
    isOpen: false,
    orderId: "",
  });

  // Lấy danh sách
  useEffect(() => {
    let isSubscribe = true;
    const getOrderList = async () => {
      try {
        setIsLoading(true);
        const response = await orderApi.getOrderList(user._id);
        if (response && isSubscribe) {
          const list = response.data.list.reverse();
          console.log("order", list);

          const newList = list.map((item, index) => {
            return {
              key: index + 1,
              orderId: item._id,
              transportFee: item.transportFee,
              paymentMethod: item.paymentMethod,
              orderCode: item.orderCode,
              orderDate: item.orderDate,
              orderProd: item.productList.map((item, index) => {
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
              orderStatus: item.orderStatus,
              total_Money: item.productList
                .map((item, index) => {
                  return {
                    key: index + 1,
                    total: item.orderProd.amount * item.orderProd.price,
                  };
                })
                .reduce((total, money) => {
                  return (total += money.total);
                }, 0),
            };
          });
          setOrderList([...newList]);
          setIsLoading(false);
        }
      } catch (error) {
        if (isSubscribe) {
          setIsLoading(false);
          setOrderList([]);
        }
      }
    };
    if (user) getOrderList();
    return () => {};
  }, [user]);

  // Cập nhật trạng thái đơn hàng
  const updateOrderStatus = async (id, orderStatus) => {
    try {
      const response = await orderApi.postCancelOrder(id, orderStatus);
      if (response) {
        setOrderList(
          orderList.map((item) =>
            item.orderId === id ? { ...item, orderStatus } : { ...item }
          )
        );
      }
    } catch (error) {
      message.success("Cập nhật thất bại");
    }
  };

  // modal cập nhật trạng thái đơn hàng
  const UpdateOrderStatusModal = (orderCode, orderId) => {
    const modal = Modal.info({
      width: 420,
      title: (
        <h3 className="t-center font-size-22px font-weight-600">
          Bạn muốn hủy đơn hàng <b style={{ color: "red" }}>#{orderCode} </b>
        </h3>
      ),
      centered: true,
      icon: null,
      closable: true,
      okText: "Đồng ý",
      onOk: () => {
        updateOrderStatus(orderId, 5);
        modal.destroy();
      },
    });
  };

  // các cột cho bảng danh sách đơn hàng
  const orderColumns = [
    {
      title: "STT",
      align: "center",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Mã đơn hàng",
      align: "center",
      dataIndex: "orderCode",
      key: "orderCode",
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
      title: "Ngày mua",
      align: "center",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (orderDate) => formatOrderDate(orderDate),
      sorter: (a, b) => {
        if (a.orderDate < b.orderDate) return -1;
        if (a.orderDate > b.orderDate) return 1;
        return 0;
      },
    },

    {
      title: "Tổng tiền",
      align: "right",
      width: 150,
      dataIndex: "totalMoney",
      key: "totalMoney",
      render: (value, records) => {
        const total = calTotalOrderFee(records);
        return formatProductPrice(total);
      },
      sorter: (a, b) => calTotalOrderFee(a) - calTotalOrderFee(b),
    },
    /*  {
      title: "Hình thức thanh toán",
      align: "center",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      onFilter: (value, record) => record.paymentMethod === value,
      render: (paymentMethod) => convertPaymentMethod(paymentMethod),
    }, */
    {
      title: "Trạng thái đơn hàng",
      align: "center",
      dataIndex: "orderStatus",
      key: "orderStatus",
      filters: generateOrderStaFilter(),
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
      render: (_v, records) => (
        <div className="action">
          {records.orderStatus === 0 ? (
            <>
              <Button
                type="link"
                onClick={() =>
                  setOrderDetails({ isOpen: true, orderId: records.orderId })
                }
                className="action-btn__see"
              >
                Chi tiết
              </Button>
              <Button
                type="link"
                className="m-l-6  action-btn__cancel"
                onClick={() =>
                  UpdateOrderStatusModal(records.orderCode, records.orderId)
                }
              >
                Hủy
              </Button>
            </>
          ) : (
            <>
              <div className="t-center">
                <Button
                  type="link"
                  onClick={() =>
                    setOrderDetails({ isOpen: true, orderId: records.orderId })
                  }
                  className="action-btn-see"
                >
                  Chi tiết
                </Button>
              </div>
            </>
          )}
        </div>
      ),
    },
  ];

  // hiển thị danh sách đơn hàng
  const showOrderList = (list) => {
    return list && list.length === 0 ? (
      <h3 className="m-t-20 t-center" style={{ color: "#888" }}>
        Hiện tại bạn chưa có đơn hàng nào
      </h3>
    ) : (
      <div className="orderList">
        <Table
          className="borderTop"
          columns={orderColumns}
          dataSource={list}
          pagination={{
            pageSize: 8,
            showSizeChanger: false,
            position: ["bottomCenter"],
          }}
        />
      </div>
    );
  };

  return (
    <>
      {isLoading ? (
        <div className="t-center m-tb-48 ">
          <Spin tip="Đang tải danh sách đơn hàng của bạn ..." size="large" />
        </div>
      ) : (
        showOrderList(orderList)
      )}
      {orderDetails.isOpen && (
        <OrderDetail
          orderId={orderDetails.orderId}
          onClose={() => setOrderDetails({ isOpen: false })}
        />
      )}
    </>
  );
};

export default Order;
