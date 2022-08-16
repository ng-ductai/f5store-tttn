/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Row, Col, Pagination, Spin, Tag } from "antd";
import productApi from "../../../apis/productApi";
import ResultFilter from "../../../components/ResultFilter";
import { FILTER_OPTION_LIST } from "../../../constants/index";
import {
  replaceMongoKeyword,
  queryString,
  addOptionToUrl,
  removeOptionToUrl,
  analysisQueryList,
  randomColor,
} from "../../../helpers";
import { RightOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Helmet from "../../../components/Helmet";
import "../index.scss";

const Phone = () => {
  let s = decodeURI("?t=0");
  // lưu state để thay đổi khi nhấn chọn các options
  const [url, setUrl] = useState(s);

  // phân tích url
  const search = replaceMongoKeyword(url);
  const queryStrList = queryString(search);
  let type = 0;
  const queryList = queryStrList.filter((item) => {
    //  type
    if (Object.keys(item)[0] === "t") {
      if (isNaN(parseInt(item.t))) type = 0;
      else type = parseInt(item.t);
      return false;
    }
    return true;
  });

  const { dOption, pOption } = analysisQueryList(queryList);
  // state pagination
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const perPage = 12;

  // filter function
  const getFilterProducts = async (currentPage, isSubscribe) => {
    try {
      setIsLoading(true);
      const productList = await productApi.getFilterProducts(
        type,
        pOption,
        dOption,
        currentPage,
        perPage
      );
      if (productList && isSubscribe) {
        const { count, list } = productList.data;
        setTotal(count);
        setList(list);
        setIsLoading(false);
      }
    } catch (error) {
      setTotal(0);
      setIsLoading(false);
      setList([]);
    }
  };

  // Lấy dữ liệu tìm kiếm
  useEffect(() => {
    let isSubscribe = true;
    setIsLoading(true);
    if (page !== 1) setPage(1);
    getFilterProducts(1, isSubscribe);

    // clean up
    return () => {
      isSubscribe = false;
    };
  }, [url]);

  // Lấy dữ liệu tìm kiếm khi đổi trang
  useEffect(() => {
    let isSubscribe = true;
    getFilterProducts(page, isSubscribe);
    // clean up
    return () => {
      isSubscribe = false;
    };
  }, [page]);

  //  Note: FILTER OPTION
  const [tagList, setTagList] = useState([]);
  const [activeList, setActiveList] = useState([]);

  // Chọn 1 btn trong bộ lọc
  const onChecked = (sub, query, key) => {
    const { title, to } = sub;
    const index = activeList.findIndex((value) => value === key);
    if (index === -1) {
      // thêm 1 key mới
      setActiveList([...activeList, key]);
      // thêm tag mới
      setTagList([...tagList, { key, query, to, title, color: randomColor() }]);
      // thay đổi url
      setUrl(addOptionToUrl(url, query.slice(0, query.length - 1), to));
    }
    // xoá key hiện tại đã chọn
    else {
      const newActiveList = [
        ...activeList.slice(0, index),
        ...activeList.slice(index + 1, activeList.length),
      ];
      setActiveList([...newActiveList]);
      setTagList([
        ...tagList.slice(0, index),
        ...tagList.slice(index + 1, tagList.length),
      ]);
      if (newActiveList.length === 0) setUrl(s);
      else setUrl(removeOptionToUrl(url, query.slice(0, query.length - 1), to));
    }
  };

  // đóng 1 tag
  const onCloseTag = (key, query, to) => {
    const index = tagList.findIndex((item) => item.key === key);
    const newTagList = [
      ...tagList.slice(0, index),
      ...tagList.slice(index + 1, tagList.length),
    ];
    setTagList([...newTagList]);
    setActiveList([
      ...activeList.slice(0, index),
      ...activeList.slice(index + 1, activeList.length),
    ]);
    if (newTagList.length === 0) setUrl(s);
    else setUrl(removeOptionToUrl(url, query, to));
  };

  // đóng tất cả các tag
  const onCloseAll = () => {
    setActiveList([]);
    setTagList([]);
    setUrl(s);
  };

  // kéo về đầu trang
  document.querySelector("body").scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });

  // hiển thị bộ lọc
  const renderFilterOption = (type) => {
    if (type < 0) return;
    const list = FILTER_OPTION_LIST.find((item) => item.key === type).data;
    return (
      list &&
      list.map((item, index) => (
        <div key={index} className="filter-item">
          <p className="filter-item_name">{item.title}</p>
          <div>
            {item.subFilters.map((sub, i) => {
              let key = index.toString() + i.toString();
              return (
                <Button
                  key={key}
                  className={`bor-rad-4 m-r-12 m-b-12 ${
                    activeList.findIndex((value) => value === key) === -1
                      ? ""
                      : "filter-btn"
                  }`}
                  onClick={() => onChecked(sub, item.query, key)}
                >
                  {sub.title}
                </Button>
              );
            })}
          </div>
        </div>
      ))
    );
  };

  // hiển thị tag đang chọn lọc
  const showTagList = () => {
    return (
      tagList &&
      tagList.map((item, index) => (
        <Tag
          className="bor-rad-4"
          key={index}
          closable={true}
          color={item.color}
          onClose={() => onCloseTag(item.key, item.query, item.to)}
        >
          {item.title}
        </Tag>
      ))
    );
  };

  return (
    <Helmet title={"Điện thoại"}>
      <div>
        <Row>
          {/* Hiển thị đường dẫn trang */}
          <Col span={24} className="p-tb-0">
            <div className="breadcrump">
              <Link to="/">
                <p className="breadcrump-homeback">Trang chủ</p>
              </Link>

              <span className="p-lr-8">
                <RightOutlined className="font-size-12px" />
              </span>

              <Link to="/dienthoai">
                <span className="breadcrump-homeback">Điện thoại</span>
              </Link>

              {/* Số  kết quả tìm kiếm */}
              {!isLoading && (
                <>
                  <span className="p-lr-8">
                    <RightOutlined className="font-size-12px" />
                  </span>
                  <h3 className="font-size-16px">
                    Có <b>{total}</b> sản phẩm
                  </h3>
                </>
              )}
            </div>
          </Col>
        </Row>

        {/* Bộ lọc  */}
        <div className="filter bor-rad-8 box-sha-home">
          <div className="filter-header">
            <b className="filter-header_title">Bộ lọc</b>
            {tagList.length > 0 && (
              <>
                <div className="d-flex align-i-center flex-wrap">
                  {showTagList()}
                </div>
                <Button
                  className="bor-rad-4"
                  type="dashed"
                  danger
                  onClick={onCloseAll}
                >
                  <b>Xoá tất cả</b>
                </Button>
              </>
            )}
          </div>
          <div className="p-lr-20 p-t-10">{renderFilterOption(type)}</div>
        </div>

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
            <ResultFilter initList={list} />

            {/* pagination */}
            {total > 0 && (
              <Pagination
                className="m-tb-16 t-center"
                total={total}
                current={page}
                showSizeChanger={false}
                pageSize={perPage}
                onChange={(p) => setPage(p)}
              />
            )}
          </>
        )}
      </div>
    </Helmet>
  );
};

export default Phone;
