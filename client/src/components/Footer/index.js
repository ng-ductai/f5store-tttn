import {
  PhoneOutlined,
  MailOutlined,
  ShopOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import React from "react";
import Grid from "../Grid";

const colum2 = [
  { display: "Giới Thiệu", path: "/about" },
  { display: "Tuyển Dụng", path: "/recruitment" },
  { display: "Điều Khoản ", path: "/policy" },
  { display: "Chính Sách Bảo Mật", path: "/security" },
];

const colum3 = [
  { display: "Trung Tâm Trợ Giúp", path: "/help" },
  { display: "Hướng Dẫn Mua Hàng", path: "/purchase" },
  { display: "Thanh Toán", path: "/payment" },
  { display: "Vận chuyển", path: "/shipping" },
];

const Footer = () => {
  return (
    <div className=" footer">
      <Grid
        col={4}
        mdCol={2}
        smCol={1}
        gap={20}
        bgr={false}
        className="footer__item"
      >
        <div className="footer__contacts">
          <div className="footer__contacts-title">About us</div>
          <div className="footer__contact">
            {colum2.map((item, index) => (
              <p key={index} className="footer__contact-txt">
                <Link to={item.path}>{item.display}</Link>
              </p>
            ))}
          </div>
        </div>

        <div className="footer__contacts">
          <div className="footer__contacts-title">Custom care</div>
          <div className="footer__contact">
            {colum3.map((item, index) => (
              <p key={index} className="footer__contact-txt">
                <Link to={item.path}>{item.display}</Link>
              </p>
            ))}
          </div>
        </div>

        <div className="footer__contacts">
          <div className="footer__contacts-title">Contact us</div>
          <div className="footer__contact1">
            <PhoneOutlined className="footer__contact1-icon" />
            <span className="footer__contact-txt">
              <a href="tel:18000000"> 1800 0000</a>
            </span>
          </div>

          <div className="footer__contact1">
            <MailOutlined className="footer__contact1-icon" />
            <span className="footer__contact-txt">
              <a href="mailto:ductai2982@gmail.com">Ductai2982@gmail.com</a>
            </span>
          </div>

          <div className="footer__contact1">
            <ShopOutlined className="footer__contact1-icon" />
            <span className="footer__contact-txt">70 Tô Ký, Q.12, TPHCM</span>
          </div>

          <div className="footer__contact1 footer__icons">
            <FacebookOutlined className="footer__icons-1" />
            <TwitterOutlined className="footer__icons-2" />
            <InstagramOutlined className="footer__icons-3" />
            <YoutubeOutlined className="footer__icons-4" />
          </div>
        </div>

        <div className="footer__map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.2946148355454!2d106.61419711457225!3d10.865181860520774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752a1a124f4105%3A0xb89315414737dcb1!2zxJDhuqFpIEjhu41jIEdpYW8gVGjDtG5nIFbhuq1uIFThuqNpIFRQIEhDTSAtIEPGoSBz4bufIDM!5e0!3m2!1svi!2s!4v1641549553741!5m2!1svi!2s"
            style={{ border: 0, width: "100%", height: "100%" }}
            allowFullScreen={true}
            loading="lazy"
            scrolling="auto"
            title="map"
          />
        </div>
      </Grid>
    </div>
  );
};

export default Footer;
