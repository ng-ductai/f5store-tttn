import {
  NotificationOutlined,
  ReconciliationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Col, Result, Row } from "antd";
import { ROUTES } from "../../constants/index";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Order from "./Order";
import Profile from "./Profile";
import Address from "./Address";
import UpdatePassword from "./UpdatePassword";
import Helmet from "../../components/Helmet";
import "./index.scss";

const AccountPage = () => {
  const { pathname } = useLocation();
  const user = useSelector((state) => state.user);
  const isAuth = useSelector((state) => state.authenticate.isAuth);
  const [activeKey, setActiveKey] = useState("profile");

  // kéo về đầu trang
  document.querySelector("body").scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });

  // menu list
  const menu = [
    {
      Icon: "",
      title: "Hồ sơ",
      key: "profile",
    },
    {
      Icon: "",
      title: "Đổi mật khẩu",
      key: "update-pw",
    },
    {
      Icon: "",
      title: "Địa chỉ giao hàng",
      key: "addresses",
    },
    {
      Icon: <ReconciliationOutlined className="icons" />,
      title: "Quản lý đơn hàng",
      key: "orders",
    },

    {
      Icon: <NotificationOutlined className="icons" />,
      title: "Thông báo",
      key: "notifications",
    },
  ];

  // render component with key
  const renderComponent = (key = "") => {
    switch (key) {
      case "profile":
        return (
          <>
            <h2 className="account-component_item">Thông tin tài khoản</h2>
            <Profile />
          </>
        );
      case "update-pw":
        return (
          <>
            <h2 className="account-component_item">Đổi mật khẩu</h2>
            <UpdatePassword />
          </>
        );
      case "orders":
        return (
          <>
            <h2 className="account-component_item">Các đơn hàng của bạn</h2>
            <Order />
          </>
        );
      case "addresses":
        return (
          <>
            <h2 className="account-component_item">
              Danh sách địa chỉ giao hàng của bạn
            </h2>
            <Address />
          </>
        );
      case "notifications":
        return (
          <>
            <h2 className="account-component_item p-b-12 borderBot">
              Thông báo
            </h2>
            <Result title="Hiện tại, không có thông báo nào !" />,
          </>
        );
      default:
        <>
          <h2 className="account-component_item">Tài khoản của tôi</h2>
          <Profile />
        </>;
    }
  };

  // lấy lại key khi bấm vào đơn hàng menu
  useEffect(() => {
    if (pathname === `${ROUTES.ACCOUNT}/orders`) setActiveKey("orders");
  }, [pathname]);

  useEffect(() => {
    if (pathname === `${ROUTES.ACCOUNT}/profile`) setActiveKey("profile");
  }, [pathname]);

  return (
    <Helmet title={"Tài khoản"}>
      {!isAuth ? (
        <div style={{ minHeight: "82vh" }}>
          <Result
            title="Đăng nhập để xem thông tin"
            extra={[
              <Button
                size="large"
                type="primary"
                key="signup"
                className="btn-secondary"
              >
                <Link to={ROUTES.SIGNUP}>Đăng ký</Link>
              </Button>,
              <Button size="large" type="primary" key="login">
                <Link to={ROUTES.LOGIN}>Đăng nhập</Link>
              </Button>,
            ]}
          />
        </div>
      ) : (
        <Row className="account">
          <Col className="account-side" span={24} md={5}>
            {/* giới thiệu */}
            <div className="account-side_intro">
              <img alt="avt" src={user.avt} className="avt" />
              <b className="name">{user.fullName}</b>
            </div>

            {/* menu */}
            <ul className="account-menu">
              <Link key="profile" to={`${ROUTES.ACCOUNT + "/profile"}`}>
                <li
                  className="account-menu_item"
                  onClick={() => setActiveKey("profile")}
                >
                  <UserOutlined className="icons" />
                  <span className="title">Thông tin tài khoản</span>
                </li>
              </Link>
              {menu.map((item, index) => (
                <>
                  {item.Icon !== "" ? (
                    <Link key={index} to={ROUTES.ACCOUNT + "/" + item.key}>
                      <li
                        className={`account-menu_item ${
                          item.key === activeKey ? "active" : ""
                        }`}
                        onClick={() => setActiveKey(item.key)}
                      >
                        {item.Icon}
                        <span className="title">{item.title}</span>
                      </li>
                    </Link>
                  ) : (
                    <Link key={item.key} to={ROUTES.ACCOUNT + "/" + item.key}>
                      <li
                        className={`account-menu_item ${
                          item.key === activeKey ? "active" : ""
                        }`}
                        onClick={() => setActiveKey(item.key)}
                      >
                        <span className="title submenu">{item.title}</span>
                      </li>
                    </Link>
                  )}
                </>
              ))}
            </ul>
          </Col>

          <Col
            className="account-component bor-rad-4 bg-white"
            span={24}
            md={19}
          >
            {renderComponent(activeKey)}
          </Col>
        </Row>
      )}
    </Helmet>
  );
};

export default AccountPage;
