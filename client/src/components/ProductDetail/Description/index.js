import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import Posts from "./Posts";
import Specification from "./Specification";
import "./index.scss";

const Description = (props) => {
  const { specification, desc } = props;
  const [isHideDesc, setIsHideDesc] = useState(false);
  const [isShowMore, setIsShowMore] = useState(false);

  // hiển thị xem thêm bài viết chi tiết
  const onSeeMore = () => {
    setIsHideDesc(!isHideDesc);
  };

  // kích thước bài viết mô tả
  useEffect(() => {
    const height = document.getElementById("descId").clientHeight;
    // Nếu chiều cao bài viết > 500px thì thu gọn
    if (height >= 500) {
      setIsShowMore(true);
    }
  }, []);

  return (
    <Row className="desc bg-white" id="descId">
      {/* Bài viết chi tiết */}
      <Col
        span={24}
        md={14}
        className={`p-16 ${!isHideDesc ? "hide-desc" : ""}  `}
      >
        <h2 className="font-weight-700">Mô tả sản phẩm</h2>
        <div className="underline-title"></div>
        <Posts content={desc} />
      </Col>

      {/* Thông số kỹ thuật */}
      <Col
        span={24}
        md={10}
        className={`p-16 ${!isHideDesc ? "hide-desc" : ""} `}
      >
        <h2 className="font-weight-700">Thông số kỹ thuật</h2>
        <div className="underline-title"></div>
        <Specification data={specification} />
      </Col>

      {/* hiển thị chế độ xem thêm */}
      {isShowMore && (
        <h3
          className="trans-margin p-tb-16 see-more ease-trans"
          onClick={onSeeMore}
        >
          {isHideDesc ? "Thu gọn " : "Xem thêm "}
          nội dung &nbsp;
          {isHideDesc ? <CaretUpOutlined /> : <CaretDownOutlined />}
        </h3>
      )}
    </Row>
  );
};

export default Description;
