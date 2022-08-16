import {
  Button,
  Col,
  Input,
  message,
  Pagination,
  Progress,
  Rate,
  Row,
} from "antd";
import commentApi from "../../../apis/commentApi";
import {
  ROUTES,
  COMMENT_PER_PAGE,
  MAX_LEN_COMMENT,
} from "../../../constants/index";
import { calStar } from "../../../helpers";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import UserComment from "./UserComment";
import "./index.scss";

const { TextArea } = Input;

const EvaluationView = (props) => {
  const { rates, cmtList, productId } = props;
  const [cmtListState, setCmtListState] = useState(cmtList);
  const { isAuth } = useSelector((state) => state.authenticate);
  const user = useSelector((state) => state.user);
  const [cmt, setCmt] = useState("");
  const star = useRef(0);
  const starAvg = calStar(rates).toFixed(1);
  const rateTotals = rates.reduce((a, b) => a + b, 0);
  const [cmtListUser, setCmtListUser] = useState([]);

  // phân trang
  const [page, setPage] = useState(1);
  const pageTotal = Math.ceil(cmtListState.length / COMMENT_PER_PAGE);
  let start = (page - 1) * COMMENT_PER_PAGE;
  const cmtListSliced = cmtListState.slice(start, start + COMMENT_PER_PAGE);

  const { accountId } = user;

  useEffect(() => {
    let isSubscribe = true;
    const getCommentUser = async () => {
      try {
        const response = await commentApi.getCommentUser(accountId, productId);
        if (response && isSubscribe) {
          const { list } = response.data;
          setCmtListUser(list.length);
        }
      } catch (error) {}
    };
    getCommentUser();
    return () => (isSubscribe = false);
  }, [accountId, productId]);

  // comment
  const onComment = async () => {
    try {
      const { accountId, avt, fullName } = user;
      const content = cmt.trim();
      if (content === "" && star.current === 0) {
        message.warning("Hãy nhập nhận xét của bạn");
        return;
      }
      let data = {
        author: { name: fullName, avt },
        productId,
        time: new Date().getTime(),
        content,
        accountId,
        rate: star.current - 1,
      };
      const response = await commentApi.postComment(data);
      if (response) {
        setCmtListState([...cmtListState, data]);
        setCmt("");
        star.current = 0;
        window.location.reload();
      }
    } catch (error) {
      message.error("Nhận xét thất bại. Thử lại", 3);
    }
  };

  useEffect(() => {
    setCmtListState(cmtList);
    return () => {};
  }, [cmtList]);

  return (
    <Row className="evaluation bg-white p-16">
      {/* tiều đề */}
      <Col span={24}>
        <h2 className="evaluation-title">Đánh giá sản phẩm</h2>
        <div className="underline-title"></div>
      </Col>

      {/* đánh giá tổng quan */}
      <Col span={24} className="p-12">
        <div className="overview">
          {/* tổng quan */}
          <div className="d-flex flex-direction-column align-i-center overview-total">
            <h2 className="font-size-32px" style={{ color: "#ff0000" }}>
              {starAvg}
            </h2>
            <Rate
              disabled
              defaultValue={starAvg}
              allowHalf
              style={{ fontSize: 12 }}
            />
            <p className="t-color-gray font-weight-500 p-t-6 font-size-18px">
              {rateTotals} đánh giá
            </p>
          </div>
          {/* progress */}
          <div className="overview-detail d-flex flex-grow-1 p-lr-16">
            {rates.map((item, index) => (
              <div key={index} className="d-flex justify-content-between">
                <Rate
                  disabled
                  defaultValue={index + 1}
                  style={{ fontSize: 14, flexBasis: 100 }}
                />
                <Progress
                  percent={(item / rateTotals) * 100}
                  type="line"
                  showInfo={false}
                  style={{ width: 172 }}
                />
                <span className="p-l-8 t-color-gray">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </Col>

      {/* nhận xét */}
      <Col span={24}>
        {cmtListSliced.map((item, index) => (
          <UserComment key={index} comment={item} />
        ))}
        {pageTotal > 1 && (
          <Pagination
            className="t-right m-b-16"
            defaultCurrent={1}
            total={pageTotal}
            pageSize={1}
            onChange={(p) => setPage(p)}
          />
        )}
      </Col>

      {/* bình luận */}
      {cmtListUser === 0 && (
        <Col span={24} className="d-flex">
          {isAuth ? (
            <>
              <TextArea
                maxLength={MAX_LEN_COMMENT}
                autoSize
                showCount
                allowClear
                value={cmt}
                id="commentArea"
                placeholder="Nhập đánh giá của bạn"
                size="large"
                className="flex-grow-1 m-r-16"
                onChange={(e) => setCmt(e.target.value)}
              />
              <Rate
                allowClear
                className="m-r-16"
                onChange={(e) => (star.current = e)}
              />
              <Button
                type="primary"
                size="large"
                style={{ flexBasis: 100 }}
                onClick={onComment}
              >
                Gửi
              </Button>
            </>
          ) : (
            <Button type="default" size="large" className="m-l-16">
              <Link to={ROUTES.LOGIN}>Đăng nhập để đánh giá</Link>
            </Button>
          )}
        </Col>
      )}
    </Row>
  );
};

EvaluationView.defaultProps = {
  rates: [0, 0, 0, 0, 0],
};

EvaluationView.propTypes = {
  cmtList: PropTypes.array || PropTypes.object,
  rates: PropTypes.array || PropTypes.object,
  productId: PropTypes.string,
  accountId: PropTypes.string,
};

export default EvaluationView;
