import { message } from "antd";
import loginApi from "../../apis/loginApi";
import ggIcon from "../../assets/icon/gg-icon.png";
import {
  DELAY_TIME,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN,
} from "../../constants/index";
import PropTypes from "prop-types";
import React from "react";
import GoogleLogin from "react-google-login";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setIsAuth } from "../../reducers/auth";
import "./index.scss";

const LoginGoogle = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  // xử lý khi đăng nhập thành công
  const onLoginSuccess = async (data) => {
    try {
      message.success("Welcome to F5 Store !");
      // lưu refresh token vào local storage
      localStorage.setItem(REFRESH_TOKEN, data.refreshToken);
      // Note: Lưu jwt vào localStorage nếu deploy heroku
      if (process.env.NODE_ENV === "production")
        localStorage.setItem(ACCESS_TOKEN_KEY, data.token);
      dispatch(setIsAuth(true));
      setTimeout(() => {
        history.push("/");
      }, DELAY_TIME);
    } catch (error) {
      message.error("Lỗi đăng nhập.");
    }
  };

  // login with Google
  const onLoginWithGoogle = async (res) => {
    try {
      console.log("res", res);
      const { accessToken } = res;

      console.log("token:", accessToken);

      const response = await loginApi.postLoginWithGoogle({
        access_token: accessToken,
      });
      const { status, data } = response;
      //login success -> redirect home
      if (status === 200) {
        onLoginSuccess(data);
      }
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message);
      } else {
        message.error("Đăng nhập thất bại, thử lại");
      }
    }
  };

  return (
    <>
      <GoogleLogin
        clientId="85q1.apps.googleusercontent.com"
        render={(renderProps) => (
          <div
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            className={`${props.className} login-with gg login-input`}
          >
            <img src={ggIcon} className="login-with__icon p-l-10" alt="" />
            <span className="login-with__title">{props.title}</span>
          </div>
        )}
        onSuccess={onLoginWithGoogle}
        onFailure={onLoginWithGoogle}
        cookiePolicy={"single_host_origin"}
      />
    </>
  );
};

LoginGoogle.defaultProps = {
  title: "Google",
  className: "",
};

LoginGoogle.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
};

export default LoginGoogle;
