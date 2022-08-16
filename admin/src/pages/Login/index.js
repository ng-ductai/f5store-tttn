import React, { useState, useEffect } from "react";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Button, Col, message, Row, Tooltip } from "antd";
import adminApi from "../../apis/adminApi";
import CheckboxField from "../../components/Custom/CheckboxField";
import InputField from "../../components/Custom/InputField";
import {
  ACCESS_TOKEN_KEY,
  DELAY_TIME,
  MAX_FAILED_LOGIN_TIMES,
  REFRESH_TOKEN,
  ROUTES,
} from "../../constants/index";
import { FastField, Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { setIsAuth } from "../../reducers/auth";
import * as Yup from "yup";
import "./index.scss";

const Login = () => {
  const history = useHistory();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDisableLogin, setIsDisableLogin] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        history.push("/dashboard");
      }, DELAY_TIME);
      message.success("Đăng nhập thành công");
    } catch (error) {
      setIsSubmitting(false);
      if (error.response) {
        const { failedLoginTimes } = error.response.data;
        const messageError = error.response.data.message;
        if (failedLoginTimes >= MAX_FAILED_LOGIN_TIMES) {
          message.error(
            'Vượt quá số lần đăng nhập.\nKiểm tra email hoặc nhấn "Quên mật khẩu"',
            4
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

  // đăng nhập
  const onLogin = async (account) => {
    try {
      setIsSubmitting(true);
      const result = await adminApi.postLogin({ account });
      if (result.status === 200) {
        onLoginSuccess(result.data);
      }
    } catch (error) {
      message.error("Đăng nhập thất bại");
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
    <div className="loginForm">
      <div className="main">
        <h1 className="loginForm-title underline-title ">
          <b className="d-flex justify-content-start align-i-end">
            Đăng nhập với Admin
          </b>
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
                <Row className="log" gutter={[40, 24]} justify="center">
                  {/* Form thông tin đăng nhập */}
                  <Col span={24}>
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
                </Row>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
