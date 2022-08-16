import { RightOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { Button, Col, Input, message, Radio, Result, Row } from "antd";
import addressApi from "../../apis/addressApi";
import orderApi from "../../apis/orderApi";
import CartPayment from "../../components/Cart/Payment";
import { TRANSPORT_METHOD_OPTIONS, ROUTES } from "../../constants/index";
import { formatProductPrice } from "../../helpers";
import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { resetCart } from "../../reducers/carts";
import "./index.scss";
import AddressUserDefault from "./address";
import Helmet from "../../components/Helmet";

// Lấy địa chỉ giao hàng của user theo index
const getUserDeliveryAdd = async (userId, index = 0) => {
  try {
    const response = await addressApi.getDeliveryAddressList(userId, 1);
    if (response) {
      return response.data.list[index];
    }
    return null; 
  } catch (err) {
    return null;
  }
};

const PaymentPage = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.authenticate.isAuth);

  // ghi chú đơn hàng
  const note = useRef("");
  const addressIndex = useRef(-1);
  const [transport, setTransport] = useState(0);
  const carts = useSelector((state) => state.carts);
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // giá tạm tính
  const tempPrice = carts.reduce(
    (a, b) => a + (b.priceNew + (b.priceNew * b.discount) / 100) * b.amount,
    0
  );

  console.log("user", user);
  const transportFee =
    tempPrice >= 2000000
      ? 0
      : TRANSPORT_METHOD_OPTIONS.find((item) => item.value === transport).price;

  // hiển thị danh sách đơn hàng
  // Note: Chưa kiểm tra tình trạng thật của sản phẩm trong db !
  const showOrderInfo = (carts) => {
    return carts.map((item, index) => (
      <>
        <div
          key={index}
          className="payment-info bg-white  bor-rad-4 d-flex  justify-content-between align-i-center "
        >
          {/* Tên sp */}
          <div className="d-flex flex-5 justify-content-left">
            <img src={item.avt} alt="hoto" />
            <div className="d-flex flex-direction-column payment-info_name">
              <div className="nameProduct1">{item.name}</div>
              <span style={{ color: "#aaa", fontSize: "14px" }}>
                {item.code}
              </span>
            </div>
          </div>

          {/* Giá */}
          <div className="d-flex flex-2 justify-content-center align-i-center">
            <p className="font-size-18px p-l-10">
              {formatProductPrice(item.priceNew)}
            </p>
          </div>

          {/*  quantity */}
          <div className="d-flex flex-1 justify-content-center align-i-center ">
            <p className="font-size-18px">{item.amount}</p>
          </div>

          {/*  Thành tiền */}
          <div className="d-flex flex-2 align-i-center justify-content-center">
            <p className="font-size-18px p-l-10">
              {formatProductPrice(item.priceNew * item.amount)}
            </p>
          </div>
        </div>
      </>
    ));
  };

  // đặt hàng
  const onCheckout = async () => {
    try {
      setIsLoading(true);
      const owner = user._id;
      const { email, fullName } = user;

      if (addressIndex.current === -1) {
        message.warn("Vui lòng chọn địa chỉ giao hàng");
        setIsLoading(false);
        return;
      }
      const deliveryAdd = await getUserDeliveryAdd(owner, addressIndex.current);
      console.log("r", deliveryAdd);

      const paymentMethod = 0,
        orderStatus = 0,
        transportMethod = transport;
      const orderDate = new Date();
      const productList = carts.map((item, index) => {
        console.log("cccc", carts);
        const { amount, avt, name, priceNew, discount, _id } = item;

        return {
          key: index,
          orderProd: { name, avt, price: priceNew, discount, amount, id: _id },
        };
      });

      const response = await orderApi.postCreateOrder({
        owner,
        email,
        fullName,
        deliveryAdd,
        paymentMethod,
        orderStatus,
        transportMethod,
        transportFee,
        orderDate,
        productList,
        note: note.current,
      });

      if (response && response.status === 200) {
        setTimeout(() => {
          setIsLoading(false);
          setIsOrderSuccess(true);
          dispatch(resetCart());
        }, 1000);
      }
    } catch (error) {
      message.error("Đặt hàng thất bại, thử lại", 3);
      setIsLoading(false);
    }
  };

  return (
    <Helmet title={"Thanh toán"}>
      {isAuth ? (
        <div className="m-tb-32 container payment">
          {isOrderSuccess ? (
            <Result
              status="success"
              title="Đơn hàng của bạn đã đặt thành công."
              subTitle="Xem chi tiết đơn hàng vừa rồi"
              extra={[
                <Button type="default" key="0">
                  <Link to={ROUTES.ACCOUNT + "/orders"}>
                    Xem chi tiết đơn hàng
                  </Link>
                </Button>,
                <Button key="1" type="primary">
                  <Link to="/">Tiếp tục mua sắm</Link>
                </Button>,
              ]}
            />
          ) : (
            <Row>
              {/* Đường dẫn */}
              <Col span={24} md={24} className="p-tb-0">
                <div className="breadcrump">
                  <Link to="/">
                    <p className="breadcrump-homeback">Trang chủ</p>
                  </Link>
                  <span className="p-lr-8">
                    <RightOutlined className="font-size-12px" />
                  </span>
                  <span className="font-size-16px">Thanh toán</span>
                </div>
              </Col>

              {/* Thông tin giao hàng  */}
              <Col span={24} md={24}>
                {/* địa chỉ giao nhận, cách thức giao */}
                <div className="bg-white bor-rad-8 payment-addr">
                  <div className="payment-addr_title d-flex align-i-center p-b-4">
                    <EnvironmentOutlined className="p-r-8 icon-map" />
                    <h4 className="payment-addr_title icon-map">Địa chỉ nhận hàng</h4>
                  </div>

                  <AddressUserDefault
                    isCheckout={true}
                    onChecked={(value) => (addressIndex.current = value)}
                  />
                </div>

                {/* thồng tin đơn hàng */}
                <div className="payment-addr bg-white bor-rad-8 m-t-14 m-b-0">
                  <div className=" d-flex justify-content-between">
                    <h4 className="payment-addr_title">Thông tin đơn hàng</h4>
                    <Button type="link" size="medium" className="m-r-8">
                      <Link to={ROUTES.CART}>Chỉnh sửa</Link>
                    </Button>
                  </div>

                  <div
                    className="payment-addr_table d-flex justify-content-between"
                    style={{ color: "#777" }}
                  >
                    <p className=" d-flex flex-5 ">Tên sản phẩm</p>
                    <p className=" d-flex flex-2 justify-content-center">
                      Đơn giá
                    </p>
                    <p className=" d-flex flex-1 justify-content-center">
                      Số lượng
                    </p>
                    <p className=" d-flex flex-2 justify-content-center">
                      Thành tiền
                    </p>
                  </div>

                  <div>{showOrderInfo(carts)}</div>
                </div>

                {/* ghi chú */}
                <div className="payment-addr bg-white bor-rad-8 m-t-8 m-b-0">
                  <div className="d-flex justify-content-left align-i-center">
                    <Col span={24} lg={2} md={3}>
                      <h3 className="payment-addr_note m-b-8 p-b-8">
                        Lời nhắn
                      </h3>
                    </Col>
                    <Col span={24} lg={22} md={21}>
                      <Input.TextArea
                        placeholder="Lưu ý cho người bán..."
                        className="note"
                        maxLength={200}
                        showCount
                        allowClear
                        onChange={(value) =>
                          (note.current = value.target.value)
                        }
                      />
                    </Col>
                  </div>
                </div>

                {/* Đơn vị vận chuyển */}
                <div className="payment-addr bg-white bor-rad-8 m-t-14 m-b-0">
                  <p className="payment-addr_title m-b-4">Đơn vị vận chuyển</p>
                  <Radio.Group
                    defaultValue={transport}
                    onChange={(e) => setTransport(e.target.value)}
                    className="m-tb-4"
                  >
                    {TRANSPORT_METHOD_OPTIONS.map((item, index) => (
                      <Radio key={index} value={item.value} className="method">
                        <div className="p-l-8 d-flex align-i-left flex-direction-column ">
                          <p className="method-label">{item.label}</p>
                          <p className="method-content">({item.content})</p>
                        </div>
                      </Radio>
                    ))}
                  </Radio.Group>
                </div>

                {/* phương thức thanh toán */}
                <div className="payment-addr bg-white bor-rad-8 m-t-14 m-b-0">
                  <h2 className="payment-addr_title m-b-6">
                    Phương thức thanh toán
                  </h2>
                  <Row gutter={[16, 16]}>
                    <Col span={24} md={12}>
                      <div className="p-tb-10 p-lr-16 item-active method">
                        <p className="method-label font-weight-500">
                          Thanh toán tiền mặt
                        </p>
                        <p className="method-content">
                          Thanh toán bằng tiền mặt khi nhận hàng tại nhà hoặc
                          tại shop.
                        </p>
                      </div>
                    </Col>
                    <Col
                      span={24}
                      md={12}
                      onClick={() =>
                        message.warn("Tính năng chưa hoàn thành", 2)
                      }
                    >
                      <div className="p-tb-10 p-lr-16 bg-gray  method">
                        <p className="method-label font-weight-500">
                          Thanh toán online
                        </p>
                        <p className="method-content">
                          Thanh toán qua Internet Banking, VNPAY.
                        </p>
                      </div>
                    </Col>
                    <Col span={24} md={15}></Col>

                    {/* đặt hàng */}
                    <Col span={24} md={9}>
                      <div className="bg-white ">
                        <CartPayment
                          isLoading={isLoading}
                          carts={carts}
                          isCheckout={true}
                          transportFee={transportFee}
                          onCheckout={onCheckout}
                        />
                        <div className="t-center p-b-16">
                          <span
                            style={{
                              color: "#ff5000",
                            }}
                          >{`( Xin quý khách vui lòng kiểm tra lại đơn hàng trước khi đặt mua )`}</span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          )}
        </div>
      ) : (
        <div style={{ minHeight: "80vh" }}>
          <Result
            title="Vui lòng đăng nhập để tiến hành đặt hàng !"
            extra={[
              <Button
                size="large"
                type="primary"
                key="signup"
                className="btn-secondary"
              >
                <Link to={ROUTES.SIGNUP}>Đăng ký</Link>
              </Button>,
              <Button size="large" type="primary" key="login">
                <Link to={ROUTES.LOGIN}>Đăng nhập</Link>
              </Button>,
            ]}
          />
        </div>
      )}
    </Helmet>
  );
};

export default PaymentPage;
