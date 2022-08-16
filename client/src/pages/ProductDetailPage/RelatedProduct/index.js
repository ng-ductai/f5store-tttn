import productApi from "../../../apis/productApi";
import RelatedProductList from "../../../components/ProductDetail/RelatedProductList";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

const RelatedProduct = (props) => {
  const { id, type, brand, title, span } = props;
  const [productList, setProductList] = useState([]);

  // Lấy ds sản phẩm
  useEffect(() => {
    let isSubscribe = true;
    const getRelatedProducts = async () => {
      try {
        const response = await productApi.getProductList(type, brand, id);
        if (response && isSubscribe) {
          setProductList(response.data.data);
        }
      } catch (error) {
        throw error;
      }
    };
    getRelatedProducts();
    return () => {
      isSubscribe = false;
    };
  }, [id, type, brand]);

  return (
    <>
      {productList && productList.length > 0 && (
        <RelatedProductList span={span} list={productList} title={title} />
      )}
    </>
  );
};

RelatedProduct.defaultProps = {
  id: "",
  type: 0,
  brand: "",
  title: "",
  span: { span: 24, xs: 24, sm: 12, md: 8, lg: 6, xl: 6 },
};

RelatedProduct.propTypes = {
  // loại, nhãn hiệu sản phẩm tương tự - sp đó
  id: PropTypes.string,
  type: PropTypes.number,
  brand: PropTypes.string,
  title: PropTypes.string,
  span: PropTypes.object,
};

export default RelatedProduct;
