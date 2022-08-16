import { Col, Row } from "antd";
import React, { useEffect } from "react";
import AnnualRevenue from "./AnnualRevenue";
import MonthlyRevenue from "./MonthlyRevenue";
import TopOrders from "./TopOrders";
import Common from "./Common";
import Helmet from "../../components/Helmet";
import TotalRevenue from "./TotalRevenue";
import AOS from "aos";
import "./index.scss";

const Dashboard = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 500,
    });
  }, []);

  return (
    <Helmet title={"Trang quản trị"}>
      <div className="home">
        <div className="home__title">
          <h2>THỐNG KÊ</h2>
        </div>

        <Row className="p-tb-10" gutter={[32, 32]}>
          {/* thống kê chung */}
          <Col span={24} xl={24}>
            <Common />
          </Col>

          {/* doanh thu theo tháng */}
          <Col
            span={24}
            xl={12}
            data-aos="fade-right"
            data-aos-duration="2000"
            data-aos-delay="1000"
          >
            <MonthlyRevenue />
          </Col>

          {/* Doanh thu theo năm */}
          <Col
            span={24}
            xl={12}
            data-aos="fade-left"
            data-aos-duration="2000"
            data-aos-delay="1500"
          >
            <AnnualRevenue />
          </Col>

          {/* Đơn hàng ở tỉnh nào nhiều nhất */}
          <Col
            span={24}
            xl={12}
            data-aos="fade-up"
            data-aos-duration="4000"
            data-aos-delay="2500"
          >
            <TopOrders />
          </Col>

          {/* Tổng doanh thu */}
          <Col
            span={24}
            xl={12}
            data-aos="fade-up"
            data-aos-duration="4000"
            data-aos-delay="2500"
          >
            <TotalRevenue />
          </Col>
        </Row>
      </div>
    </Helmet>
  );
};

export default Dashboard;
