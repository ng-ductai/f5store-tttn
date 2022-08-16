import { RightOutlined } from "@ant-design/icons";
import { Button, Col, Popconfirm, Row } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { resetCart } from "../../reducers/carts";
import Helmet from "../Helmet";
import CartOverview from "./Overview";
import CartPayment from "./Payment";
import "./index.scss";

const Cart = () => {
  const carts = useSelector((state) => state.carts);
  const dispatch = useDispatch();

  // Xoá tất cả sản phẩm trong cart
  const onDelAllCarts = () => {
    dispatch(resetCart());
  };

  // kéo về đầu trang
  document.querySelector("body").scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });

  return (
    <Helmet title={"Giỏ hàng"}>
      <div className="cart">
        <Row gutter={[16, 0]}>
          {/* Hiển thị đường dẫn trang */}
          <Col span={24} className="p-t-0">
            <div className="breadcrump">
              <Link to="/">
                <p className="breadcrump-homeback">Trang chủ</p>
              </Link>
              <span className="p-lr-8 ">
                <RightOutlined className="font-size-12px" />
              </span>
              <span className="breadcrump-title">Giỏ hàng</span>
            </div>
          </Col>

          {carts.length > 0 ? (
            <>
              {/* Tổng sản phẩm */}
              <Col
                span={24}
                className="d-flex justify-content-between p-t-0 p-b-4"
              >
                <p className="cart-quan">
                  Bạn có
                  <b>{` ${carts.reduce(
                    (a, b) => a + parseInt(b.amount),
                    0
                  )} `}</b>
                  sản phẩm trong giỏ hàng
                </p>
                <Popconfirm
                  title="Bạn có chắc muốn xoá toàn bộ sản phẩm trong giỏ hàng ?"
                  placement="left"
                  okButtonProps={{ type: "primary" }}
                  onConfirm={onDelAllCarts}
                  okText="Đồng ý"
                  cancelText="Huỷ bỏ"
                >
                  <Button className="cart-clear" type="link" danger>
                    Xoá tất cả
                  </Button>
                </Popconfirm>
              </Col>
              <Col span={24} className="p-t-4 p-b-4">
                <div className="bg-white cart-title">
                  <p className="d-flex flex-5">Tên sản phẩm</p>
                  <p className="d-flex flex-2 justify-content-center">
                    Đơn giá
                  </p>
                  <p className="d-flex flex-1 justify-content-center">
                    Số lượng
                  </p>
                  <p className="d-flex flex-1 justify-content-center">
                    Thành tiền
                  </p>
                  <p className="d-flex flex-1 justify-content-center">
                    Thao tác
                  </p>
                </div>
              </Col>

              {/* Chi tiết giỏ hàng */}
              <Col span={24} md={24}>
                <CartOverview carts={carts} />
              </Col>

              <Col span={24} md={15}></Col>

              {/* Thanh toán */}
              <Col span={24} md={9}>
                <CartPayment carts={carts} />
              </Col>
            </>
          ) : (
            <Col span={24} className="t-center" style={{ minHeight: "90vh" }}>
              <h2 className="m-tb-16" style={{ color: "#888" }}>
                Hiện tại bạn chưa có sản phẩm nào trong giỏ hàng
              </h2>
              <Link to="/">
                <Button type="primary" size="large">
                  Mua sắm ngay nào
                </Button>
              </Link>
            </Col>
          )}
        </Row>
      </div>
    </Helmet>
  );
};

export default Cart;
