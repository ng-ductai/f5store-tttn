import productApi from "../../apis/productApi";
import GlobalLoading from "../../components/Loading";
import ProductDetail from "../../components/ProductDetail";
import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import Helmet from "../../components/Helmet";

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isProduct, setIsProduct] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // lấy sản phẩm
  useEffect(() => {
    let isSubscribe = true;
    const getProduct = async (id) => {
      try {
        const result = await productApi.getProduct(id);
        if (result && isSubscribe) {
          const { data } = result;
          setProduct(data);
        }
      } catch (error) {
        if (isSubscribe) setIsProduct(true);
      }
    };
    getProduct(productId);
    if (isSubscribe) setProduct(null);

    return () => (isSubscribe = false);
  }, [productId]);

  return (
    <Helmet title={"Sản phẩm"}>
      {product ? (
        <ProductDetail products={product} />
      ) : (
        <GlobalLoading content="Đang tải sản phẩm ..." />
      )}
      {isProduct && <Redirect to="/not-found" />}
    </Helmet>
  );
};

export default ProductDetailPage;
