import React, { useState, useEffect } from "react";
import { Badge, Dropdown, Menu, message } from "antd";
import loginApi from "../../apis/loginApi";
import logoUrl from "../../assets/imgs/logo5.png";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  ROUTES,
} from "../../constants/index";
import { autoSearchOptions } from "../../helpers";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Cart from "./Cart";
import Search from "./Search";
import User from "./User";

const totalItemCarts = (carts) => {
  if (carts) {
    return carts.reduce((total, item) => total + item.amount, 0);
  }
};

const Header = () => {
  const { isAuth } = useSelector((state) => state.authenticate);
  const user = useSelector((state) => state.user);
  const carts = useSelector((state) => state.carts);
  const options = autoSearchOptions();
  const [linkSearch, setLinkSearch] = useState("");
  const [isMdDevice, setIsMdDevice] = useState(false);

  //  lay window width
  useEffect(() => {
    const w = window.innerWidth;
    if (w <= 992) setIsMdDevice(true);

    window.addEventListener("resize", function () {
      const width = window.innerWidth;
      if (width <= 992) {
        setIsMdDevice(true);
      } else {
        setIsMdDevice(false);
      }
    });

    return () => {
      window.removeEventListener("resize");
    };
  }, []);

  // log out
  const onLogout = async () => {
    try {
      const response = await loginApi.postLogout();
      if (response) {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        message.success("Đăng xuất thành công", 2);
        setTimeout(() => {
          window.location.reload();
        }, 700);
      }
    } catch (error) {
      message.error("Đăng xuất thất bại", 2);
    }
  };

  const renderNonLoggedInMenu = () => {
    return (
      <div className="non__logged">
        <a href="/login" className="non__logged_login">
          Đăng nhập
        </a>
        /
        <a href="/signup" className="non__logged_signup">
          Đăng ký
        </a>
      </div>
    );
  };

  // menu
  const menu = (
    <Menu className="m-t-14 p-tb-6 bor-rad-6" style={{ width: 222 }}>
      <Menu.Item key={1}>
        <Link to={"/sacduphong"}>
          <p className="header-left__menu--item">Sạc, pin dự phòng</p>
        </Link>
      </Menu.Item>
      <Menu.Item key={2}>
        <Link to={"/tainghe"}>
          <p className="header-left__menu--item">Tai nghe</p>
        </Link>
      </Menu.Item>
    </Menu>
  );

  // menu tablet
  const menuTablet = (
    <Menu className="m-t-0 bor-rad-6 p-tb-6" style={{ width: 200 }}>
      <Menu.Item key={0}>
        <Link to={"/dienthoai"}>
          <p className="header-left__menu--item">Điện thoại</p>
        </Link>
      </Menu.Item>
      <Menu.Item key={1}>
        <Link to={"/sacduphong"}>
          <p className="header-left__menu--item">Sạc, pin dự phòng</p>
        </Link>
      </Menu.Item>
      <Menu.Item key={2}>
        <Link to={"/tainghe"}>
          <p className="header-left__menu--item">Tai nghe</p>
        </Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="wrapper">
      <div className="header">
        {/*  header left */}
        <div className="header-left">
          <div className="header-left__logo">
            <Link to="/">
              <img
                alt="logo"
                src={logoUrl}
                width={isMdDevice ? 48 : 58}
                height={isMdDevice ? 48 : 58}
              />
            </Link>
          </div>

          {!isMdDevice ? (
            <>
              <div className="header-left__menu">
                <Link to={"/dienthoai"}>
                  <span> ĐIỆN THOẠI</span>
                </Link>
                <div className="hover__animation"></div>
              </div>

              <div className="header-left__menu">
                <Dropdown
                  overlay={menu}
                  className="menu"
                  placement="bottomRight"
                  arrow
                >
                  <div className="cursor">
                    <span> PHỤ KIỆN</span>
                  </div>
                </Dropdown>
                <div className="hover__animation"></div>
              </div>

              <div className="header-left__menu">
                <Link to={"/news"}>
                  <span>TIN TỨC</span>
                </Link>
                <div className="hover__animation"></div>
              </div>
            </>
          ) : (
            <>
              <Dropdown overlay={menuTablet} placement="bottomRight" arrow>
                <div className="cursor">
                  <span className="catalog-title">DANH MỤC</span>
                </div>
              </Dropdown>
            </>
          )}
        </div>

        {/*  header center */}
        <div className="header-center">
          <Search
            options={options}
            linkSearch={linkSearch}
            setLinkSearch={setLinkSearch}
          />
        </div>

        {/*  header right */}
        <div className="header-right">
          {isAuth ? (
            <User user={user} onLogout={onLogout} />
          ) : (
            renderNonLoggedInMenu()
          )}

          <div className="header-right__cart">
            <Dropdown
              overlay={<Cart list={carts} />}
              placement="bottomRight"
              arrow
            >
              <Link className="d-flex p-l-0" to={ROUTES.CART}>
                <i className="fab fa-opencart icon cart m-r-12"></i>
                <Badge
                  className="pos-absolute"
                  size="default"
                  style={{ color: "#fff" }}
                  count={totalItemCarts(carts)}
                  offset={[18, -10]}
                />
              </Link>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
