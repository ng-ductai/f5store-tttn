import { Carousel, Row, Col } from "antd";
import React from "react";
import "./index.scss";

const list = [
  "https://res.cloudinary.com/ductai2982/image/upload/v1654711565/users/slider/720x220-720x220-5_ms2o43.png",
  "https://res.cloudinary.com/ductai2982/image/upload/v1654711564/users/slider/800-200-800x200-14_gszngh.png",
];

const ProductCarousel = () => {
  return (
    <Row gutter={[8, 0]}>
      <Col span={13}>
        <Carousel className="carousel" autoplay>
          {list.map((item, index) => (
            <img
              className="carousel-img"
              src={item}
              key={index}
              alt="carousel"
            />
          ))}
        </Carousel>
      </Col>

      <Col span={11}>
        <div className="carousel">
          <img
            className="carousel-img"
            src="https://res.cloudinary.com/ductai2982/image/upload/v1654711862/users/slider/800-200-800x200-3_lvuas5.png"
            alt="carousel"
          />
        </div>
      </Col>
    </Row>
  );
};

export default ProductCarousel;
