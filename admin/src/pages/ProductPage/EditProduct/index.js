import React, { useState, useEffect } from "react";
import { Col, Row } from "antd";
import { RightOutlined } from "@ant-design/icons";
import productApi from "../../../apis/productApi";
import { useParams, Link } from "react-router-dom";
import BackupCharger from "./BackupCharger";
import Headphone from "./Headphone";
import Mobile from "./Mobile";
import "./index.scss";

const EditProduct = (props) => {
  const [products, setProducts] = useState(null);
  const { productId } = useParams();

  useEffect(() => {
    let isSubscribe = true;
    const getProduct = async (id) => {
      try {
        const result = await productApi.getProduct(id);
        if (result && isSubscribe) {
          const { data } = result;
          setProducts(data);
        }
      } catch (error) {
        if (isSubscribe) setProducts(null);
      }
    };
    getProduct(productId);
    if (isSubscribe) setProducts(null);
    return () => (isSubscribe = false);
  }, [productId]);

  if (!products) {
    return null;
  }
  const { product, productDetail } = products;

  const { type, name } = product;

  // Render ra component tương ứng khi chọn loại sp
  const onRenderProduct = (value) => {
    switch (value) {
      case 0:
        return (
          <Mobile product={products.product} productDetail={productDetail} />
        );
      case 1:
        return (
          <BackupCharger
            product={products.product}
            productDetail={productDetail}
          />
        );
      case 2:
        return (
          <Headphone product={products.product} productDetail={productDetail} />
        );

      default:
        break;
    }
  };

  return (
    <>
      <Row>
        {/* Hiển thị đường dẫn trang */}
        <Col span={24} className="p-tb-0">
          <div className="breadcrump">
            <Link to="/dashboard">
              <p className="breadcrump-homeback">Trang chủ</p>
            </Link>
            <span className="p-lr-8">
              <RightOutlined className="breadcrump-arrow" />
            </span>
            <Link to="/products">
              <span className="breadcrump-homeback">Quản lý sản phẩm</span>
            </Link>
            <span className="p-lr-8">
              <RightOutlined className="breadcrump-arrow" />
            </span>
            <span className="breadcrump-homeback">Sửa</span>
            <span className="p-lr-8">
              <RightOutlined className="breadcrump-arrow" />
            </span>
            <span className="breadcrump-title">{name}</span>
          </div>
        </Col>
      </Row>

      <h1 className="t-center p-b-6">
        <b className="line-height-28px"> Cập nhật sản phẩm</b>
      </h1>
      <div className="p-b-20">
        <Col span={24}>{onRenderProduct(type)}</Col>
      </div>
    </>
  );
};
export default EditProduct;
