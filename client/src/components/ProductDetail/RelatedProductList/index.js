import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { convertWidthScreen } from "../../../helpers";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ProductView from "../../ProductView";
import "./index.scss";

const RelatedProductList = (props) => {
  const { list, title, span } = props;

  const perPage = useRef(1);
  const [page, setPage] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMdDevice, setIsMdDevice] = useState(false);

  // resize window
  useEffect(() => {
    const w = window.innerWidth;
    if (w <= 768) setIsMdDevice(true);
    else setIsMdDevice(false);

    const handleResize = () => {
      const w = window.innerWidth;
      setWindowWidth(w);
      if (w <= 768) setIsMdDevice(true);
      else setIsMdDevice(false);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // phân trang
  const paginate = (list) => {
    const windowSize = convertWidthScreen(windowWidth);
    if (span.hasOwnProperty(windowSize))
      perPage.current = 24 / span[windowSize];
    else {
      const spanValues = Object.values(span);
      let min = Math.min(...spanValues);
      perPage.current = 24 / min;
    }

    return list.slice(perPage.current * (page - 1), perPage.current * page);
  };

  // Hiển thị danh sách sản phẩm
  const showProductList = (list) => {
    const listSliced = paginate(list);

    return listSliced.map((product, index) => {
      const { name, avt, price, discount, stock, _id } = product;
      return (
        <Col key={index} {...span}>
          <Link to={`/product/${_id}`} className="item">
            <ProductView
              className={isMdDevice ? "m-auto" : ""}
              name={name}
              avtUrl={avt}
              discount={discount}
              stock={stock}
              price={price}
              height={isMdDevice ? 380 : 420}
            />
          </Link>
        </Col>
      );
    });
  };

  return (
    <Row className="relate bg-white p-16 bor-rad-8">
      {/* tiêu đề */}
      {title !== "" && (
        <Col span={24}>
          <h2 className="font-weight-700">{title}</h2>
          <div className="underline-title"></div>
        </Col>
      )}

      {/* list */}
      <Col span={24}>
        <Row gutter={[8, 8]} className="m-t-16">
          {showProductList(list, span)}
        </Row>
      </Col>

      {/* Mũi tên*/}
      <LeftCircleOutlined
        className={`arrow arrow-left ${page <= 1 ? "disabled" : ""}`}
        onClick={() => setPage(page - 1)}
      />
      <RightCircleOutlined
        className={`arrow arrow-right ${
          page >= Math.ceil(list.length / perPage.current) ? "disabled" : ""
        }`}
        onClick={() => setPage(page + 1)}
      />
    </Row>
  );
};

RelatedProductList.defaultProps = {
  list: [],
  title: "",
  span: { span: 24, xs: 24, sm: 12, md: 8, lg: 6, xl: 4 },
};

RelatedProductList.propTypes = {
  list: PropTypes.array,
  title: PropTypes.string,
  span: PropTypes.object,
};

export default RelatedProductList;
