import { DeleteOutlined } from "@ant-design/icons";
import { InputNumber } from "antd";
import { formatProductPrice } from "../../../helpers";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

const CartItem = (props) => {
  const {
    _id,
    name,
    code,
    avt,
    stock,
    discount,
    priceNew,
    amount,
    index,
    onDelCartItem,
    onUpdateNumOfProd,
  } = props;
  
  return (
    <div className="bg-white bor-rad-4 cartItem">
      {/* tên sản phẩm */}
      <div className="d-flex flex-5">
        <img src={avt} alt="hoto" className="img" />
        <div className="d-flex flex-direction-column name">
          <Link to={`/product/${_id}`} className="nameProduct">
            {name}
          </Link>
          <span style={{ color: "#777", fontSize: "13px" }}>{code}</span>
        </div>
      </div>

      {/* Giá */}
      <div className="price flex-2">
        <span className="price-old">
          {discount > 0
            ? formatProductPrice(priceNew / (1 - discount / 100))
            : ""}
        </span>
        <p className="p-l-12 price-new">{formatProductPrice(priceNew)}</p>
      </div>

      {/*  quantity */}
      <div className="flex-1 quantity">
        <InputNumber
          height={24}
          min={1}
          max={stock}
          value={amount}
          onChange={(value) => onUpdateNumOfProd(index, value)}
          size="medium"
          style={{ borderColor: "#4267b2" }}
        />
      </div>

      {/* Thanh tien*/}
      <div className="d-flex align-i-center justify-content-center flex-1">
        <p className="price-new p-l-12">
          {formatProductPrice(priceNew * amount)}
        </p>
      </div>

      {/* Thao tac */}
      <div className="d-flex align-i-center justify-content-center flex-1">
        <DeleteOutlined
          className="m-l-20 icon-del"
          onClick={() => onDelCartItem(index)}
        />
      </div>
    </div>
  );
};

CartItem.defaultProps = {
  _id: "",
  avt: "",
  code: "",
  discount: 0,
  name: "",
  priceNew: 0,
  stock: 0,
  amount: 1,
};

CartItem.propTypes = {
  onDelCartItem: PropTypes.func,
  onUpdateNumOfProd: PropTypes.func,
  index: PropTypes.any,
  _id: PropTypes.string,
  avt: PropTypes.string,
  code: PropTypes.string,
  discount: PropTypes.number,
  amount: PropTypes.number,
  name: PropTypes.string,
  priceNew: PropTypes.number,
  stock: PropTypes.number,
};

export default CartItem;
