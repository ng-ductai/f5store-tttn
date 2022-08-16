import productApi from "../../../apis/productApi";
import RelatedProductList from "../../../components/ProductDetail/RelatedProductList";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

const SellProduct = (props) => {
  const { title, span } = props;
  const [productList, setProductList] = useState([]);

  // Lấy ds sản phẩm bán chạy
  useEffect(() => {
    let isSubscribe = true;
    const getProductListSoldBest = async () => {
      try {
        const response = await productApi.getProductListSoldBest();
        if (response && isSubscribe) {
          setProductList(response.data.data);
        }
      } catch (error) {
        throw error;
      }
    };
    getProductListSoldBest();
    return () => {
      isSubscribe = false;
    };
  }, []);

  return (
    <>
      {productList && productList.length > 0 && (
        <RelatedProductList span={span} list={productList} title={title} />
      )}
    </>
  );
};

SellProduct.defaultProps = {
  title: "",
  span: { span: 24, xs: 24, sm: 12, md: 8, lg: 6, xl: 6},
};

SellProduct.propTypes = {
  title: PropTypes.string,
  span: PropTypes.object,
};

export default SellProduct;
