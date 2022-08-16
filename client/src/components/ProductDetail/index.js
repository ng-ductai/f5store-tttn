import { RightOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import Evaluation from "../../pages/ProductDetailPage/Evaluation";
import RelatedProduct from "../../pages/ProductDetailPage/RelatedProduct";
import { convertProductValue } from "../../helpers";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import Description from "./Description";
import Overview from "./Overview";
import "./index.scss";

const ProductDetail = (props) => {
  const { products } = props;
  const { productDetail, productDesc } = products;
  let { catalogs, ...restDetail } = productDetail;
  const { name, brand, type, _id, rate } = products.product;
  restDetail = convertProductValue(type, restDetail);



  const menu = [
    {
      type: 0,
      title: "Điện thoại",
      path: "/dienthoai",
    },
    {
      type: 1,
      title: "Pin, sạc dự phòng",
      path: "/sacduphong",
    },
    {
      type: 2,
      title: "Tai nghe",
      path: "/tainghe",
    },
  ];

  let breadcrumb = menu.filter((animal) => {
    return animal.type === products.product.type;
  });



  return (
    <div className="detail">
      <Row>
        {/* Hiển thị đường dẫn trang */}
        <Col span={24} className="p-tb-0">
          <div className="breadcrump">
            <Link to="/">
              <p className="breadcrump-homeback">Trang chủ</p>
            </Link>
            <span className="p-lr-8">
              <RightOutlined className="font-size-12px" />
            </span>
            {breadcrumb.map((item, index) => (
              <Link to={item.path} key={index}>
                <p className="breadcrump-homeback">{item.title}</p>
              </Link>
            ))}

            <span className="p-lr-8">
              <RightOutlined className="font-size-12px" />
            </span>
            <span className="breadcrump-title">{name}</span>
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Thông tin cơ bản của sản phẩm */}
        <Col span={24} md={24} className="p-0 bor-rad-8">
          <Overview products={products} />
        </Col>

        {/* Mô tả chi tiết sản phẩm */}
        <Col span={24} className="p-0 bor-rad-8">
          <Description
            specification={{ brand, ...restDetail }}
            desc={productDesc}
          />
        </Col>

        {/* Nhận xét của khách hàng */}
        <Col span={24} id="evaluation" className="p-0 bor-rad-8">
          <Evaluation rates={rate} productId={_id} />
        </Col>

        {/* danh sách sản phẩm tương tự */}
        <Col span={24} className="p-0 bor-rad-8">
          <RelatedProduct
            title="Sản phẩm tương tự"
            type={type}
            brand={brand}
            id={_id}
          />
        </Col>
      </Row>
    </div>
  );
};

ProductDetail.propTypes = {
  products: PropTypes.object,
};

export default ProductDetail;
