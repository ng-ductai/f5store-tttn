import { HomeOutlined, MessageOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import Helmet from "../Helmet";

const NotFound = () => {
  return (
    <Helmet title={"Not Found"}>
      <Result
        status="404"
        title="404 - Không tìm thấy trang"
        subTitle="Xin lỗi, trang bạn truy cập không tồn tại."
        extra={
          <>
            <a
              href="https://www.facebook.com/nguyenductai.taismile2k/"
              target="blank"
            >
              <Button type="dashed" size="large">
                <MessageOutlined /> Liên hệ
              </Button>
            </a>
            <Link to="/">
              <Button type="primary" size="large">
                <HomeOutlined /> Về trang chủ
              </Button>
            </Link>
          </>
        }
      />
    </Helmet>
  );
};

export default NotFound;
