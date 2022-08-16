import { formatProductPrice } from "../../helpers";
import PropTypes from "prop-types";
import React from "react";
import "./index.scss";

const ProductView = (props) => {
  const { className, name, price, avtUrl, discount, stock, action } = props;

  return (
    <div className={`Product-View  p-b-10 ${className}`}>
      <div className="image">
        <img className="img" src={avtUrl} alt="Product Photos" />
      </div>

      {/* Tên sản phẩm */}
      <div className="nameProduct">{name}</div>

      {/* Giá sản phẩm */}
      <div className="Product-View-price m-b-10 p-l-6">
        {price > 0 && (
          <>
            {discount > 0 && (
              <div>
                <span className="Product-View-price--cancel font-weight-400 font-size-18px">
                  {formatProductPrice(price)}
                </span>
                <span className="m-l-12 Product-View-price--discount font-size-18px">
                  -{discount}%
                </span>
              </div>
            )}
            <span className="Product-View-price--main font-size-20px font-weight-b">
              {formatProductPrice(price * (1 - discount / 100))}
            </span>
          </>
        )}
        {!price && (
          <span className="Product-View-price--contact font-size-20px">
            Liên hệ đặt trước
          </span>
        )}
      </div>

      {/* Số lượng hàng còn, chỉ hiển thị khi còn ít hơn 5 */}
      {stock <= 5 && stock > 0 && (
        <div className="Product-View-stock font-size-14px">
          chỉ còn {stock} sản phẩm
        </div>
      )}

      {/* Số lượng hàng còn, chỉ hiển thị khi còn ít hơn 5 */}
      {stock === 0 && price > 0 && (
        <b className="Product-View-stock m-l-6 font-size-16px">Đang hết hàng</b>
      )}

      {stock === 0 && price === 0 && (
        <b className="Product-View-stock font-size-16px m-l-12">Hàng sắp về</b>
      )}

      {/* Các nút bấm thêm nếu có */}
      <div className="d-flex m-t-10 justify-content-end">
        {action.length > 0 && action.map((Item) => Item)}
      </div>
    </div>
  );
};

// default props
ProductView.defaultProps = {
  price: 0,
  stock: 1,
  action: [],
  className: "",
};

// check prop type
ProductView.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  price: PropTypes.number,
  avtUrl: PropTypes.string,
  discount: PropTypes.number,
  stock: PropTypes.number,
  action: PropTypes.any,
  style: PropTypes.object,
  height: PropTypes.number,
  maxWidth: PropTypes.number,
};

export default ProductView;
