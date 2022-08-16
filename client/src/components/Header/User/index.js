import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { renderPhotoAccout } from "../../../utils/avartarChange";
import { reduceProductName } from "../../../helpers";
import { ROUTES } from "../../../constants/index";

const User = (props) => {
  const { user, onLogout } = props;
  const userRef = useRef(null);

  const handle = () => {
    if (userRef.current) {
      userRef.current.classList.add("active");
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", (e) => {
      if (!e.target.closest("#userId") && !e.target.closest("#userDragId")) {
        if (userRef.current) {
          userRef.current.classList.remove("active");
        }
      }
    });
    return () => {
      window.removeEventListener("mousemove", null);
    };
  }, []);

  return (
    <div className="header-right__user" onMouseEnter={handle} id="userId">
      <Link to={ROUTES.ACCOUNT + "/profile"}>
        <div className="header-right__user-info">
          <span className="info__avt">
            {renderPhotoAccout(user.avt, 40, "")}
          </span>
          <span className="info__title">
            {reduceProductName(user.userName, 12)}
          </span>
        </div>
      </Link>

      <div
        className="header-right__user-drawer"
        id="userDragId"
        ref={userRef}
      >
        <Link to={ROUTES.ACCOUNT + "/profile"}>
          <div className="header-right__user-drawer-account">
            <i className="fad fa-user"></i>
            <p className="display-title">
              Tài khoản
            </p>
          </div>
        </Link>
        <Link to={ROUTES.ACCOUNT + "/orders"}>
          <div className="header-right__user-drawer-account">
            <i className="fad fa-calendar-week"></i>
            <p className="display-title">
              Đơn mua
            </p>
          </div>
        </Link>

        <div className="header-right__user-drawer-account user__link">
          <i className="fad fa-sign-in-alt"></i>
          <p onClick={onLogout} className="display-title">
            Đăng xuất
          </p>
        </div>
      </div>
    </div>
  );
};

export default User;
