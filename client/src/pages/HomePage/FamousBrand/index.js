import { Col, Row } from "antd";
import React from "react";
import Slider from "react-slick";
import "./index.scss";

// danh sách thương hiệu
const list = [
  {
    link: "https://www.apple.com/vn/",
    src: "http://appleaz.vn/wp-content/uploads/banner-apple-san-pham.jpg",
    title: "Apple",
    desc: "Bé rồng đỏ siêu cute, gaming",
  },
  {
    link: "https://www.samsung.com/us/",
    src: "https://www.samsung.com/global/galaxy/main/images/banner_beijing2020_s.jpg",
    title: "Samsung",
    desc: "Samsung siêu cấp vip pro",
  },
  {
    link: "https://miot-global.com/",
    src: "https://miot-global.com/uploads/Slide/redmi-note-9_1_1594196169.jpg",
    title: "Xiaomi",
    desc: "Siêu ưu đãi cùng với xiaomi",
  },
  {
    link: "https://www.sony.com.vn/",
    src: "https://cdn.tgdd.vn/Files/2020/05/06/1253776/xperia-10-ii-1_800x450.jpg",
    title: "SONY",
    desc: "Sản phẩm siêu chất lượng",
  },
];

// hiển thị danh sách thương hiệu
const showBrandList = (list) => {
  return list.map((item, index) => (
    <div key={index}>
      <div className="brand-item t-center">
        <a href={item.link} target="blank" className="image">
          <img className="bor-rad-8" src={item.src} alt="brand" />
        </a>
        <h4 className="brand-item_title">{item.title}</h4>
        <span className="font-size-16px p-b-15 p-t-4">{item.desc}</span>
      </div>
    </div>
  ));
};

var settings = {
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
};

const FamousBrand = () => {
  return (
    <div className="p-16 brand bg-white box-sha-home bor-rad-8">
      <Row>
        <Col span={24}>
          <h2 className="font-weight-700">Thương hiệu nổi bật</h2>
          <div className="underline-title"></div>
        </Col>
      </Row>
      <div className="brand-slider">
        <Slider {...settings}>{showBrandList(list)}</Slider>
      </div>
    </div>
  );
};

export default FamousBrand;
