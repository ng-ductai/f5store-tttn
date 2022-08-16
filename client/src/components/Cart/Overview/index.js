import PropTypes from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import CartItem from "./CartItem";
import "./index.scss";
import { updateCartItem, delCartItem } from "../../../reducers/carts";

const CartOverview = (props) => {
  const { carts } = props;
  const dispatch = useDispatch();

  // xoá 1 sản phẩm trong cart
  const onDelCartItem = (key) => {
    dispatch(delCartItem(key));
  };

  // cập nhật số lượng sản phẩm trong cart
  const onUpdateNumOfProd = (key, value) => {
    dispatch(updateCartItem(key, value));
  };

  return (
    <>
      {carts.map((item, index) => (
        <div key={index} className="m-b-6">
          <CartItem
            index={index}
            {...item}
            onDelCartItem={onDelCartItem}
            onUpdateNumOfProd={onUpdateNumOfProd}
          />
        </div>
      ))}
    </>
  );
};

CartOverview.defaultProps = {
  carts: [],
};

CartOverview.propTypes = {
  carts: PropTypes.array,
};

export default CartOverview;
