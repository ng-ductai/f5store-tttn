/* eslint-disable react-hooks/exhaustive-deps */
import { Pagination, Spin } from "antd";
import productApi from "../../../apis/productApi";
import ResultSearch from "../../../components/ResultFilter";
import { queryString } from "../../../helpers";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCarousel from "../../../components/ProductCarousel";
import Helmet from "../../../components/Helmet";

const SearchResult = () => {
  // get query param
  const search = useLocation().search;
  const query = queryString(search);

  // keyword search
  let keyword = query.find((item) => item.hasOwnProperty("keyword"));
  let keywordValue = "";
  if (keyword !== undefined)
    keywordValue = decodeURI(keyword.keyword.replace(/[+]/gi, " "));

  console.log("key", keywordValue);
  // state pagination
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // tìm kiếm
  const getSearchProducts = async (currentPage, isSubscribe) => {
    try {
      const result = await productApi.getSearchProducts(
        keywordValue,
        currentPage,
        8
      );
      if (result && isSubscribe) {
        const { list, count } = result.data;
        setList(list);
        setTotal(count);
        setIsLoading(false);
      }
    } catch (error) {
      setList([]);
      setTotal(0);
      setIsLoading(false);
    }
  };

  // Lấy dữ liệu tìm kiếm
  useEffect(() => {
    let isSubscribe = true;
    setIsLoading(true);
    if (page !== 1) setPage(1);

    const getSearchProducts = async (currentPage, isSubscribe) => {
      try {
        const result = await productApi.getSearchProducts(
          keywordValue,
          currentPage,
          8
        );
        if (result && isSubscribe) {
          const { list, count } = result.data;
          setList(list);
          setTotal(count);
          setIsLoading(false);
        }
      } catch (error) {
        setList([]);
        setTotal(0);
        setIsLoading(false);
      }
    };
    getSearchProducts(1, isSubscribe);

    // clean up
    return () => {
      isSubscribe = false;
    };
  }, [search]);

  // Lấy dữ liệu tìm kiếm khi đổi trang
  useEffect(() => {
    let isSubscribe = true;
    setIsLoading(true);

    getSearchProducts(page, isSubscribe);
    // clean up
    return () => {
      isSubscribe = false;
    };
  }, [page]);

  return (
    <Helmet title={"Tìm kiếm"}>
      <div className="search">
        {/* Carousel */}
        <ProductCarousel />

        {/* Số  kết quả tìm kiếm */}
        {!isLoading && (
          <h2 className="search-title">
            Tìm được <b>{total}</b> sản phẩm{" "}
            {keywordValue !== "" ? `cho "${keywordValue}"` : ""}
          </h2>
        )}

        {/* loading */}
        {isLoading ? (
          <Spin
            className="trans-center"
            tip="Đang tải dữ liệu ..."
            size="large"
          />
        ) : (
          <>
            {/* Kết quả lọc, tìm kiếm */}
            <ResultSearch initList={list} />
            {/* pagination */}
            {total > 0 && (
              <Pagination
                className="m-tb-16 t-center"
                total={total}
                current={page}
                showSizeChanger={false}
                pageSize={12}
                onChange={(p) => setPage(p)}
              />
            )}
          </>
        )}
      </div>
    </Helmet>
  );
};

export default SearchResult;
