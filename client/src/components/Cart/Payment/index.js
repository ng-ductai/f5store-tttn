import { Button } from "antd";
import { ROUTES } from "../../../constants/index";
import { formatProductPrice } from "../../../helpers";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";

const CartPayment = (props) => {
  const { carts, isCheckout, transportFee, onCheckout, isLoading } = props;
  // giá tạm tính
  const tempPrice = carts.reduce((a, b) => a + b.priceNew * b.amount, 0);
  // tổng khuyến mãi
  const totalDiscount = carts.reduce(
    (a, b) =>
      a +
      (((b.priceNew / (1 - b.discount / 100)) * b.discount) / 100) * b.amount,
    0
  );

  return (
    <div className="total bg-white bor-rad-4">
      {isCheckout ? (
        <>
          <div className="total-item p-b-12 total-item">
            <span className="font-size-18px" style={{ color: "#333" }}>
              Tổng tiền hàng
            </span>
            <p style={{ color: "#333", fontSize: 20 }}>
              {formatProductPrice(tempPrice)}
            </p>
          </div>
          <div className="total-item p-b-12">
            <span className="font-size-18px" style={{ color: "#333" }}>
              Phí vận chuyển
            </span>
            {transportFee > 0 ? (
              <p className="font-size-20px">
                {formatProductPrice(transportFee)}
              </p>
            ) : (
              <p className="font-size-18px">Miễn phí</p>
            )}
          </div>

          <div className="total-item">
            <span className="font-size-18px" style={{ color: "#333" }}>
              Tổng thanh toán
            </span>
            <b style={{ color: "red", fontSize: 24 }}>
              {formatProductPrice(tempPrice + transportFee)}
            </b>
          </div>
          <div className="t-end">
            <span
              style={{ color: "#aaa", fontSize: 16 }}
            >{`(Đã bao gồm VAT)`}</span>
          </div>
          <Button
            onClick={onCheckout}
            className="m-t-16 d-block m-lr-auto w-100"
            type="primary"
            size="large"
            loading={isLoading}
            style={{ backgroundColor: "#3555c5", color: "#fff" }}
          >
            ĐẶT HÀNG NGAY
          </Button>
        </>
      ) : (
        <div className="p-tb-10 p-lr-12">
          <div className="total-item p-b-8">
            <span className="font-size-18px " style={{ color: "#666" }}>
              Tổng thanh toán
            </span>
            <b style={{ color: "red", fontSize: 20 }}>
              {formatProductPrice(tempPrice + transportFee)}
            </b>
          </div>

          <div className="total-item m-b-6">
            <span className="font-size-18px" style={{ color: "#666" }}>
              Tiết kiệm
            </span>
            <b style={{ fontSize: 18 }}>{formatProductPrice(totalDiscount)}</b>
          </div>
          <div className="t-end">
            <span
              style={{ color: "#666", fontSize: 16 }}
            >{`(Đã bao gồm VAT)`}</span>
          </div>
          <Link to={ROUTES.PAYMENT}>
            <Button
              className="m-t-16 d-block m-lr-auto w-100"
              type="primary"
              size="large"
              style={{ backgroundColor: "#3555c5", color: "#fff" }}
            >
              MUA HÀNG
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

CartPayment.defaultProps = {
  carts: [],
  isCheckout: false, // cờ kiểm tra có phải ở trang checkout để lập đơn hàng hay k
  transportFee: 0,
  isLoading: false,
};

CartPayment.propTypes = {
  carts: PropTypes.array,
  isCheckout: PropTypes.bool,
  transportFee: PropTypes.number,
  onCheckout: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default CartPayment;
