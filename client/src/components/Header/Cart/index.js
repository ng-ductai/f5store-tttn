import { Button, List } from "antd";
import { ROUTES } from "../../../constants/index";
import { formatProductPrice } from "../../../helpers";
import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";

const Cart = (props) => {
  const { list } = props;
  const length = list.length;

  return (
    <div className="cart-view p-tb-0 p-lr-2">
      <div className="font-size-18px p-tb-8 p-lr-14 " style={{ color: "#aaa" }}>
        Sản phẩm mới thêm
      </div>
      <div className="cart-items">
        <List
          itemLayout="vertical"
          size="large"
          dataSource={list}
          renderItem={(item) => (
            <div className="item">
              <div className="item__left flex-2">
                <img
                  style={{ width: 50, height: 50 }}
                  src={item.avt}
                  alt="avt"
                />
                <p className="p-l-10 p-t-4 nameProduct2"> {item.name} </p>
              </div>
              <p className="product-price flex-1">
                {formatProductPrice(item.priceNew)}
              </p>
            </div>
          )}
        />
      </div>

      <div className="cart-additional p-8">
        <Link to={length > 0 ? ROUTES.CART : "/"}>
          <Button
            className="m-b-8 d-block m-lr-auto w-100"
            type="primary"
            size="large"
          >
            {length > 0 ? "Đến giỏ hàng" : "Mua ngay"}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Cart;
