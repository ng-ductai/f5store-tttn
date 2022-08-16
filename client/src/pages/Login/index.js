import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Button, Col, message, Row, Tooltip } from "antd";
import loginApi from "../../apis/loginApi";
import CheckboxField from "../../components/Custom/CheckboxField";
import InputField from "../../components/Custom/InputField";
import LoginGoogle from "../../components/LoginGoogle";
import {
  MAX_FAILED_LOGIN_TIMES,
  ROUTES,
  REFRESH_TOKEN,
  DELAY_TIME,
  ACCESS_TOKEN_KEY,
} from "../../constants/index";
import { FastField, Form, Formik } from "formik";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { setIsAuth } from "../../reducers/auth";
import * as Yup from "yup";
import "./index.scss";

const Login = () => {
  const history = useHistory();
  const windowWidth = window.screen.width;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDisableLogin, setIsDisableLogin] = useState(false);
  const dispatch = useDispatch();

  // kéo về đầu trang
  document.querySelector("body").scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });

  // xử lý khi đăng nhập thành công
  const onLoginSuccess = async (data) => {
    try {
      setIsSubmitting(false);
      // lưu refresh token vào local storage
      localStorage.setItem(REFRESH_TOKEN, data.refreshToken);
      // Note: Lưu jwt vào localStorage nếu deploy heroku
      if (process.env.NODE_ENV === "production")
        localStorage.setItem(ACCESS_TOKEN_KEY, data.token);
      dispatch(setIsAuth(true));
      setTimeout(() => {
        history.push("/");
      }, DELAY_TIME);
      message.success("Welcome to F5 Store !", 2);
    } catch (error) {
      message.error("Lỗi đăng nhập.");
    }
  };

  // đăng nhập
  const onLogin = async (account) => {
    console.log("acc", account);
    try {
      setIsSubmitting(true);
      const result = await loginApi.postLogin({ account });
      if (result.status === 200) {
        onLoginSuccess(result.data);
      }
    } catch (error) {
      setIsSubmitting(false);
      if (error.response) {
        const { failedLoginTimes } = error.response.data;
        const messageError = error.response.data.message;
        if (failedLoginTimes >= MAX_FAILED_LOGIN_TIMES) {
          message.error(
            'Vượt quá số lần đăng nhập.\nVui lòng kiểm tra email hoặc nhấn "Quên mật khẩu"',
            3.5
          );
          setIsDisableLogin(true);
        } else {
          message.error(messageError);
        }
      } else {
        message.error("Đăng nhập thất bại");
      }
    }
  };

  // giá trọ khởi tạo cho formik
  const initialValue = {
    email: "",
    password: "",
    keepLogin: false,
  };

  // validate form trước submit với yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .required("* Email bạn là gì ?")
      .email("* Email không hợp lệ !"),
    password: Yup.string().trim().required("* Mật khẩu của bạn là gì ?"),
  });

  return (
    <div className="login  p-t-15">
      <h1 className=" m-b-24 underline-title">
        <b>Đăng nhập</b>
      </h1>
      <Formik
        initialValues={initialValue}
        validationSchema={validationSchema}
        onSubmit={onLogin}
      >
        {(formikProps) => {
          const suffixColor = "rgba(0, 0, 0, 0.25)";
          return (
            <Form className="bg-form">
              <Row className="login-form" gutter={[0, 24]} justify="center">
                {/* Form thông tin đăng nhập */}
                <Col span={24} className="m-t-12">
                  <FastField
                    name="email"
                    component={InputField}
                    className="input-form-common"
                    placeholder="Email *"
                    size="large"
                    suffix={
                      <Tooltip title="Email của bạn">
                        <InfoCircleOutlined
                          style={{
                            color: suffixColor,
                          }}
                        />
                      </Tooltip>
                    }
                  />
                </Col>
                <Col span={24}>
                  <FastField
                    name="password"
                    component={InputField}
                    className="input-form-common"
                    type="password"
                    placeholder="Mật khẩu *"
                    size="large"
                    autocomplete="on"
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Col>
                <Col span={24}>
                  <div className="d-flex justify-content-between">
                    <FastField name="keepLogin" component={CheckboxField}>
                      <b>Duy trì đăng nhập</b>
                    </FastField>
                    <Link
                      to={ROUTES.FORGOT_PASSWORD}
                      style={{ color: "#50aaff" }}
                    >
                      <b>Quên mật khẩu ?</b>
                    </Link>
                  </div>
                </Col>

                {/* Button submit */}
                <Col className="p-t-8 p-b-0 t-center" span={24}>
                  <Button
                    className="login-submit-btn w-100"
                    size="large"
                    type="primary"
                    htmlType="submit"
                    disabled={isDisableLogin}
                    loading={isSubmitting}
                  >
                    Đăng nhập
                  </Button>
                </Col>
                <Col span={24} className="p-t-0 t-center">
                  <div className="or-option">HOẶC</div>
                  <div className="p-t-12 font-size-16px font-weight-500 pointer">
                    <LoginGoogle
                      title={
                        windowWidth > 350 ? "Đăng nhập với Google" : "Google"
                      }
                    />
                  </div>

                  <div className="m-t-20 m-b-12 font-weight-500">
                    Bạn chưa đã có tài khoản ?
                    <Link
                      className="p-l-4 font-size-16px font-weight-600"
                      to={ROUTES.SIGNUP}
                    >
                      &nbsp;<span style={{ color: "#4267b2" }}> Đăng ký</span>
                    </Link>
                  </div>
                </Col>
              </Row>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default Login;
