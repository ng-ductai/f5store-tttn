import { Col, Pagination, Row, Spin } from "antd";
import productApi from "../../../apis/productApi";
import ProductView from "../../../components/ProductView";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AllProduct = () => {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // lấy sản phẩm
  useEffect(() => {
    let isSubscribe = true;
    setIsLoading(true);
    const getAllProducts = async () => {
      try {
        const response = await productApi.getAllProducts(page, 12);
        if (response && isSubscribe) {
          const { data, count } = response.data;
          setList(data);
          setTotal(count);
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    };

    getAllProducts();

    return () => (isSubscribe = false);
  }, [page]);

  // Hiển thị sản phẩm
  const showProducts = (list) => {
    list = list ? list : [];
    console.log("list", list);
    return list.map((product, index) => {
      const { avt, name, price, discount, stock, _id } = product;

      return (
        <Col key={index} span={24} sm={12} md={8} lg={8} xl={6}>
          <Link to={`/product/${_id}`}>
            <ProductView
              className="m-auto"
              name={name}
              price={price}
              stock={stock}
              avtUrl={avt}
              discount={discount}
            />
          </Link>
        </Col>
      );
    });
  };

  return (
    <Row className="p-16" style={{ minHeight: 400 }} gutter={[8, 8]}>
      <Col span={24} className="m-b-16">
        <h2 className="font-weight-700 ">Tất cả sản phẩm</h2>
        <div className="underline-title"></div>
      </Col>
      {isLoading ? (
        <Spin
          className="trans-center"
          tip="Đang tải sản phẩm ..."
          size="large"
        />
      ) : (
        <>
          {showProducts(list)}
          <Col span={24} className="m-tb-20">
            <Pagination
              className="t-center"
              current={page}
              pageSize={12}
              total={total}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
            />
          </Col>
        </>
      )}
    </Row>
  );
};

export default AllProduct;
