import { Button, Col, InputNumber, Row, Spin } from "antd";
import productNotFoundUrl from "../../assets/imgs/not-product.png";
import ProductView from "../ProductView";
import { calStar } from "../../helpers";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./index.scss";

const ResultFilter = (props) => {
  const { initList } = props;
  const [list, setList] = useState([...initList]);
  const [isLoading, setIsLoading] = useState(false);
  const [price, setPrice] = useState({ from: 0, to: 0 });
  const [sortBtnActive, setSortBtnActive] = useState(0);
  const sortButtons = [
    { key: 1, title: "Giá giảm dần" },
    { key: 2, title: "Giá tăng dần" },
    { key: 3, title: "Bán chạy nhất" },
    { key: 4, title: "Đánh giá tốt nhất" },
    { key: 5, title: "Khuyến mãi tốt nhất" },
  ];

  // sắp xếp danh sách theo key
  const onSort = (type = 0) => {
    if (type) {
      if (type === sortBtnActive) {
        // trả về danh sách ban đầu
        setList([...initList]);
        setSortBtnActive(0);
        return;
      } else {
        setIsLoading(true);
        setSortBtnActive(type);
      }

      let newList = [];
      switch (type) {
        // theo giá giảm dần
        case 1:
          newList = list.sort(
            (a, b) =>
              b.price * (1 - b.discount / 100) -
              a.price * (1 - a.discount / 100)
          );
          break;
        // theo giá tăng dần
        case 2:
          newList = list.sort(
            (a, b) =>
              a.price * (1 - a.discount / 100) -
              b.price * (1 - b.discount / 100)
          );
          break;
        // bán chạy nhất
        case 3:
          newList = list.sort((a, b) => b.sold - a.sold);
          break;
        // đánh giá tốt nhất
        case 4:
          newList = list.sort((a, b) => calStar(b.rate) - calStar(a.rate));
          break;
        // Khuyến mãi tốt nhất
        case 5:
          newList = list.sort((a, b) => b.discount - a.discount);
          break;
        default:
          setIsLoading(false);
          break;
      }

      // delay
      setTimeout(() => {
        setIsLoading(false);
        setList(newList);
      }, 200);
    }
  };

  // Lọc theo giá
  const onFilterByPrice = () => {
    setIsLoading(true);
    const { from, to } = price;
    let newList = initList.filter(
      (item) => item.price >= from && item.price <= to
    );
    // delay
    setTimeout(() => {
      setIsLoading(false);
      setList(newList);
    }, 200);
  };

  // Hiển thị sản phẩm
  const showProducts = (list) => {
    list = list ? list : [];
    return list.map((product, index) => {
      const { avt, name, price, discount, stock, _id } = product;
      return (
        <Col key={index} span={24} md={8} lg={6}   >
          <Link to={`/product/${_id}`}>
            <ProductView
              name={name}
              price={price}
              stock={stock}
              avtUrl={avt}
              discount={discount}
              height={400}
            />
          </Link>
        </Col>
      );
    });
  };

  return (
    <Row className="filter bor-rad-8 box-sha-home">
      {/* header sort, search button */}
      <Col span={24} className="filter-header">
        <div className="sort">
          <h3 className="sort-left">Sắp xếp theo</h3>
          <div className="sort-right">
            {sortButtons.map((item) => (
              <Button
                className={`${
                  item.key === sortBtnActive ? "sort-btn-active" : ""
                } sort-btn bor-rad-4 `}
                key={item.key}
                size="medium"
                onClick={() => onSort(item.key)}
              >
                {item.title}
              </Button>
            ))}
            {/* search range price */}
            <div className="m-l-8">
              <InputNumber
                className="bor-rad-4"
                size="medium"
                min={0}
                max={1000000000}
                style={{ width: 120 }}
                placeholder="Giá thấp nhất"
                step={100000}
                onChange={(value) => setPrice({ ...price, from: value })}
              />
              {` - `}
              <InputNumber
                className="bor-rad-4"
                size="medium"
                min={price.from}
                max={1000000000}
                style={{ width: 120 }}
                placeholder="Giá cao nhất"
                step={1000000}
                onChange={(value) => setPrice({ ...price, to: value })}
              />
              {price.to > 0 && (
                <Button
                  type="primary"
                  size="medium"
                  className="m-l-8 price-search-btn bor-rad-4"
                  onClick={onFilterByPrice}
                >
                  Lọc
                </Button>
              )}
            </div>
          </div>
        </div>
      </Col>

      {/* render list */}
      <Col span={24} className="filter-list ">
        {!list || list.length === 0 ? (
          <div className="trans-center d-flex flex-direction-column pos-relative">
            <img
              className="not-found_product m-0-auto"
              src={productNotFoundUrl}
              alt=""
            />
            <span className="font-size-16px m-t-8 t-center">
              Không sản phẩm nào được tìm thấy
            </span>
          </div>
        ) : isLoading ? (
          <Spin
            className="trans-center"
            tip="Đang cập nhật sản phẩm ..."
            size="large"
          />
        ) : (
          <Row gutter={[8, 8]}>{showProducts(list)}</Row>
        )}
      </Col>
    </Row>
  );
};

ResultFilter.defaultProps = {
  initList: [],
};

ResultFilter.propTypes = {
  initList: PropTypes.array,
};

export default ResultFilter;
