import { PhoneOutlined } from "@ant-design/icons";
import { Button, Col, Image, InputNumber, Rate, Row } from "antd";
import ImgLoadFailed from "../../../assets/imgs/loading-img-failed.png";
import real from "../../../assets/icon/real.png";
import refund from "../../../assets/icon/refund.png";
import truck from "../../../assets/icon/truck.png";
import { ROUTES } from "../../../constants/index";
import {
  reduceProductName,
  formatProductPrice,
  calStar,
  convertProductColor,
  convertProductBrand,
} from "../../../helpers";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../../../reducers/carts";
import Slider from "react-slick";
import "./index.scss";

// đếm số sản phẩm trong giỏ hàng
const countItemInCart = (productCode, carts) => {
  let count = 0;
  if (carts) {
    carts.forEach((item) => {
      if (item.code === productCode) count += item.amount;
    });
  }
  return count;
};

const ProductOverview = (props) => {
  const { products } = props;
  const { _id, avt, name, brand, code, price, rate, discount, stock } =
    products.product;
  const { catalogs, color, ...rest } = products.productDetail;
  const imgList = [avt, ...catalogs];
  const rateTotal = rate.reduce((a, b) => a + b, 0);
  const priceNew = price - (price * discount) / 100;
  const rateAvg = calStar(rate).toFixed(1);
  console.log("rest", rest);

  const [numOfProduct, setNumberOfProduct] = useState(1);
  const [avtIndex, setAvtIndex] = useState(0);
  const carts = useSelector((state) => state.carts);
  const currentStock = stock - countItemInCart(code, carts);
  const dispatch = useDispatch();

  const newColor = convertProductColor(color);

  // danh sách hình ảnh sp
  const showCatalogs = (catalog) => {
    return catalog.map((item, index) => (
      <Image
        key={index}
        src={item}
       
        
        className={`catalog-item ${index === avtIndex ? "active" : ""}`}
        onMouseEnter={() => setAvtIndex(index)}
      />
    ));
  };

  // Thêm vào giỏ hàng
  const addCart = () => {
    let product = {
      code,
      name,
      priceNew,
      amount: numOfProduct,
      avt,
      discount,
      stock,
      _id,
    };
    setNumberOfProduct(1);
    dispatch(addToCart(product));
  };

  var settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Row className="overview bg-white">
      {/* Hình ảnh và thông số cơ bản sản phẩm */}
      <Col span={24} md={12} lg={11} className="overview-img">
        <div className="d-flex align-i-center justify-content-center ">
          <Image
            style={{ height: "375px" }}
            fallback={ImgLoadFailed}
            src={imgList[avtIndex]}
          />
        </div>
        <div className="overview-img__slider ">
          <Slider {...settings}>{showCatalogs(imgList)}</Slider>
        </div>
      </Col>

      {/* Tên và thông tin cơ bản */}
      <Col span={24} md={12} lg={13} className="overview-detail">
        {/* Tên sp */}
        <h2 className="overview-detail__name">
          {reduceProductName(name, 140)}
        </h2>

        {/* Đánh giá sản phẩm */}
        <a href="#evaluation" className="overview-detail__reviews">
          <p className="star">{rateAvg}</p>
          <Rate disabled defaultValue={rateAvg} allowHalf />
          <p className="review">{rateTotal} Đánh giá</p>
        </a>

        {/* Mã, thương hiệu */}
        <div className="overview-detail__brand">
          Thương hiệu:
          <span className="product-brand">
            &nbsp;{convertProductBrand(brand)}
          </span>
          &nbsp; | Mã sản phẩm:
          <span className="product-brand">
            &nbsp;<span>{code}</span>
          </span>
        </div>

        {/* Giá */}
        {discount === 0 && price > 0 && (
          <>
            <h1 className="product-price">{formatProductPrice(priceNew)}</h1>
          </>
        )}

        {discount > 0 && price > 0 && (
          <>
            <div className="discount">
              <h3 className="oldPrice">{formatProductPrice(price)}</h3>
              <span className="newPrice">{formatProductPrice(priceNew)}</span>
              <h3 className="dis font-weight-700">- {discount}% </h3>
            </div>
          </>
        )}

        {discount === 0 && price === 0 && (
          <>
            <div className="furturePrice">
              <h3 className="furturePrice_item">Giá đang cập nhật</h3>
            </div>
          </>
        )}

        {/* Protection */}
        <div className="overview-detail__protection">
          <p className="item">Protection </p>
          <p className="content">Bảo hiểm Thiết bị di động</p>
          <p className="more">More</p>
        </div>

        {/* Màu sp */}
        <div className="overview-detail__color">
          <h3 className="item">Màu sắc </h3>
          <p className="color"> {newColor} </p>
        </div>

        {/* Chọn số lượng */}
        <div className="overview-detail__option">
          {currentStock === 0 ? (
            price > 0 ? (
              <h3 className="outStock">
                <span>Sản phẩm hiện đang hết hàng !</span>
              </h3>
            ) : (
              <h3 className="outStock">
                <span>Hàng sắp về !</span>
              </h3>
            )
          ) : (
            <>
              <div className="buy">
                <h3 className="buy_left">Số lượng </h3>
                <InputNumber
                  name="numOfProduct"
                  size="medium"
                  value={numOfProduct}
                  min={1}
                  max={currentStock}
                  onChange={(value) => setNumberOfProduct(value)}
                />
                <h3 className="buy_right ">{stock} sản phẩm có sẵn </h3>
              </div>
            </>
          )}
        </div>

        {/* Button*/}
        {price > 0 && currentStock > 0 ? (
          <div className="btn-group">
            <Button
              onClick={addCart}
              disabled={stock ? false : true}
              size="large"
              className="btn-group-item"
            >
              <i className="fas fa-cart-plus p-r-10"></i>
              Thêm vào giỏ hàng
            </Button>

            <Button
              onClick={addCart}
              disabled={stock ? false : true}
              size="large"
              className=" btn-group-item"
              style={{ backgroundColor: "#ff3535" }}
            >
              <Link to={ROUTES.PAYMENT}> Mua ngay</Link>
            </Button>
          </div>
        ) : (
          <Button
            size="large"
            className="m-tb-16 w-40 btn-group-item"
            style={{ backgroundColor: "#3555c5" }}
          >
            <a
              href="https://www.facebook.com/nguyenductai.taismile2k/"
              target="blank"
            >
              <PhoneOutlined style={{ fontSize: 18 }} className="m-r-8" /> LIÊN
              HỆ
            </a>
          </Button>
        )}

        {/* policy */}
        <div className="overview-detail__policies">
          <div className="policy_item">
            <img src={real} className="m-r-3" alt="real" />
            Chính hãng 100%
          </div>
          <div className="policy_item">
            <img src={truck} className="m-r-3" alt="truck" />
            Giao miễn phí
          </div>
          <div className="policy_item">
            <img src={refund} className="m-r-3" alt="refund" /> Miễn phí trả
            hàng
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default ProductOverview;
