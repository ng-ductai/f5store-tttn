import { Button, message } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import adminApi from "../../apis/adminApi";
import { REFRESH_TOKEN_KEY, ACCESS_TOKEN_KEY } from "../../constants/index";
import { useSelector } from "react-redux";
import React from "react";
import { useHistory, Link } from "react-router-dom";

const Header = () => {
  const user = useSelector((state) => state.user);
  const history = useHistory();

  console.log("user", user);

  // log out
  const onLogout = async () => {
    try {
      const response = await adminApi.postLogout();
      if (response) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        message.success("Đăng xuất thành công", 2);
        setTimeout(() => {
          history.push("/login");
          window.location.reload();
        }, 700);
      }
    } catch (error) {
      message.error("Đăng xuất thất bại", 2);
    }
  };

  return (
    <>
      <div className="header">
        <div className="header-menu">
          <Link to="/dashboard">
            <div className="d-flex align-i-center header-left">
              <Avatar
               
                className="header-left__avt"
                src="https://res.cloudinary.com/ductai2982/image/upload/v1654766753/users/slider/logo4_onr1nl.jpg"
              />
              <span className="header-left__title">F5 STORE</span>
            </div>
          </Link>

          <div className="header-right">
            <div className="header-right__admin p-r-24">
              <Avatar size={40} className="m-r-16 avt" src={user.avt} />
              <span className="title">{user.userName}</span>
            </div>

            <Button
              onClick={onLogout}
              className="header-right__btn"
              type="dashed"
            >
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
