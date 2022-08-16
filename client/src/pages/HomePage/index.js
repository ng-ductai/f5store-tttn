import React, { useEffect, useState } from "react";
import HeroSlides from "../../components/HeroSlides";
import Grid from "../../components/Grid";
import Section from "../../components/Section";
import Policy from "../../components/Policy";
import { policy } from "../../constants";
import { Col, Row } from "antd";
import AllProduct from "./AllProduct";
import FamousBrand from "./FamousBrand";
import { Link } from "react-router-dom";
import sliderApi from "../../apis/sliderApi";
import SellProduct from "./SellProduct";
import Helmet from "../../components/Helmet";
import { Fade } from "react-reveal";

const HomePage = () => {
  const [data, setData] = useState([]);

  // kéo về đầu trang
  document.querySelector("body").scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });

  // Lấy danh sách slider
  useEffect(() => {
    let isSubscribe = true;
    const getSliderList = async () => {
      try {
        const response = await sliderApi.getSliderList();
        if (response && isSubscribe) {
          const list = response.data.list.reverse();
          const listWittKey = list.map((item, index) => {
            return { ...item, key: index + 1 };
          });
          setData(listWittKey);
        }
      } catch (error) {}
    };
    getSliderList();

    return () => {
      isSubscribe = false;
    };
  }, []);

  return (
    <Helmet title={"Trang chủ"}>
      <div className="Home">
        {/* Carousel*/}
        <HeroSlides data={data} control={true} auto={true} timeOut={5000} />

        {/* policy */}
        <Fade duration={1500} bottom>
          <Section>
            <Grid col={4} mdCol={2} smCol={1} gap={16}>
              {policy.map((item, index) => (
                <Link to="/policy" key={index}>
                  <Policy
                    name={item.name}
                    description={item.description}
                    icon={item.icon}
                  />
                </Link>
              ))}
            </Grid>
          </Section>
        </Fade>

        <Row className="container">
          {/* Thương hiệu nổi bật */}

          <Col span={24} className="m-b-32">
            <Fade duration={1500} delay={500} left>
              <FamousBrand />
            </Fade>
          </Col>

          {/* Sản phẩm bán chạy */}
          <Fade duration={1500} right>
            <Col span={24} className="m-b-32 bg-white box-sha-home bor-rad-8">
              <SellProduct title="Sản phẩm bán chạy" />
            </Col>
          </Fade>

          {/* Tổng hợp sản phẩm */}
          <Fade duration={1000} bottom>
            <Col span={24} className="m-b-32 bg-white box-sha-home bor-rad-8">
              <AllProduct />
            </Col>
          </Fade>
        </Row>
      </div>
    </Helmet>
  );
};

export default HomePage;
