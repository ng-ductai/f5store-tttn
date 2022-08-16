import React from "react";
import {
  HomeOutlined,
  IdcardOutlined,
  SlidersOutlined,
  ReconciliationOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const menuList = [
  {
    key: "d",
    path: "/dashboard",
    title: "Trang chủ",
    icon: <HomeOutlined />,
  },
  {
    key: "p",
    path: "/products",
    title: "Quản lý sản phẩm",
    icon: <ShoppingOutlined />,
  },
  {
    key: "c",
    path: "/customers",
    title: "Quản lý khách hàng",
    icon: <UserOutlined />,
  },
  {
    key: "a",
    path: "/admin/all",
    title: "Quản lý Admin",
    icon: <IdcardOutlined />,
  },
  {
    key: "o",
    path: "/orders",
    title: "Quản lý đơn hàng",
    icon: <ReconciliationOutlined />,
  },
  {
    key: "s",
    path: "/sliders/all",
    title: "Quản lý slider",
    icon: <SlidersOutlined />,
  },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const activeNav = menuList.findIndex((e) => e.path === pathname);

  // render menu
  const renderMenuItem = () => {
    return menuList.map((item, index) => {
      const { key, title, path, icon } = item;

      return (
        <Link to={path} key={key}>
          <li className={` menu-item ${index === activeNav ? "active" : ""}`}>
            <span className="menu-item__icon">{icon}</span>
            <span className="menu-item__title">{title}</span>
          </li>
        </Link>
      );
    });
  };

  return (
    <div className="sidebar">
      <div className="sidebar__wrapper">
        <ul className="sidebar__wrapper_menu">{renderMenuItem()}</ul>
      </div>
    </div>
  );
};

export default Sidebar;
