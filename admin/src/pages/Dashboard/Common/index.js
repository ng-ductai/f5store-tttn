import React, { useEffect, useState } from "react";
import { Col, Row, message, Spin } from "antd";
import {
  ReconciliationOutlined,
  ShoppingOutlined,
  UserOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import adminApi from "../../../apis/adminApi";
import productApi from "../../../apis/productApi";
import { Link } from "react-router-dom";
import "./index.scss";

const Common = () => {
  const [countProduct, setCountProduct] = useState([]);
  const [countCus, setCountCus] = useState([]);
  const [countAd, setCountAd] = useState([]);
  const [countOrder, setCountOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProductList = async () => {
      try {
        const response = await productApi.getAllProducts(-1);
        if (response) {
          const { data } = response.data;
          let total = data.length;
          setCountProduct(total);
        }
      } catch (error) {
        message.error("Thống kê số lượng sản phẩm thất bại.");
      }
    };
    getProductList();
  }, []);

  useEffect(() => {
    const getCustomerList = async () => {
      try {
        const response = await adminApi.getCustomerList();
        if (response) {
          const { list } = response.data;
          let l = list.filter((animal) => {
            return animal.role === "0";
          });

          let total = l.length;
          setCountCus(total);
        }
      } catch (error) {
        message.error("Thống kê số lượng khách hàng thất bại.");
      }
    };
    getCustomerList();
  }, []);

  useEffect(() => {
    const getCustomerList = async () => {
      try {
        setIsLoading(true);
        const response = await adminApi.getCustomerList();
        if (response) {
          const { list } = response.data;
          let l = list.filter((animal) => {
            return animal.role === "1";
          });

          let total = l.length;
          setCountAd(total);
          setIsLoading(false);
        }
      } catch (error) {
        message.error("Thống kê số lượng admin thất bại.");
        setIsLoading(false);
      }
    };
    getCustomerList();
  }, []);

  useEffect(() => {
    const getOrderList = async () => {
      try {
        const response = await adminApi.getOrderList();
        if (response) {
          const { list } = response.data;

          let total = list.length;
          setCountOrder(total);
        }
      } catch (error) {
        message.error("Thống kê số lượng đơn hàng thất bại.");
      }
    };
    getOrderList();
  }, []);

  const menu = [
    {
      title: "Sản phẩm",
      count: countProduct,
      icon: <ShoppingOutlined />,
      path: "products",
      bgColor: "bgblue",
      bgColor2: "bgblue1",
      content: "Quản lý sản phẩm",
    },
    {
      title: "Khách hàng",
      count: countCus,
      icon: <UserOutlined />,
      path: "customers",
      bgColor: "bgyellow",
      bgColor2: "bgyellow1",
      content: "Quản lý khách hàng",
    },
    {
      title: "Admin",
      count: countAd,
      icon: <i className="far fa-user-circle"></i>,
      path: "/admin/all",
      bgColor: "bggreen",
      bgColor2: "bggreen1",
      content: "Quản lý admin",
    },
    {
      title: "Đơn đặt hàng",
      count: countOrder,
      icon: <ReconciliationOutlined />,
      path: "orders",
      bgColor: "bgorange",
      bgColor2: "bgorange1",
      content: "Quản lý đơn hàng",
    },
  ];

  return (
    <div className="t-center">
      {isLoading ? (
        <Spin
          tip="Đang thống kê ..."
          size="large"
          indicator={<LoadingOutlined spin />}
        />
      ) : (
        <div className="bg-white commons bor-rad-8 box-sha-home">
          <Row gutter={[16, 16]}>
            {menu.map((item, index) => (
              <>
                <Col span={6} md={12} xl={6} key={index}>
                  <Link to={item.path} className="common">
                    <div className={`common-top ${item.bgColor}`}>
                      <div className="common-top__left">
                        <h1 className="common-top__left-count">{item.count}</h1>
                        <p className="common-top__left-title">{item.title}</p>
                      </div>
                      <div className="common-top__right">
                        <h2 className="icon">{item.icon}</h2>
                      </div>
                    </div>
                    <p className={`common-bottom ${item.bgColor2}`}>
                      {item.content}
                    </p>
                  </Link>
                </Col>
              </>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default Common;
