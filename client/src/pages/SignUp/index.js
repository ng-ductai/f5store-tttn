import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Button, Col, message, Row, Tooltip } from "antd";
import accountApi from "../../apis/accountApi";
import InputField from "../../components/Custom/InputField";
import Delay from "../../components/Delay";
import LoginGoogle from "../../components/LoginGoogle";
import { MAX_VERIFY_CODE, DELAY_TIME, ROUTES } from "../../constants/index";
import { FastField, Form, Formik } from "formik";
import React, { useRef, useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import * as Yup from "yup";
import "./index.scss";

const SignUp = () => {
  const windowWidth = window.screen.width;

  // trạng thái gửi mã xác thực
  const [isSending, setIsSending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirectLogin, setIsRedirectLogin] = useState(false);
  // ref kiểm tra đã nhập email hay chưa, hỗ trợ việc gửi mã xác nhận
  const emailRef = useRef("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // gửi mã xác nhận
  const onSendCode = async () => {
    try {
      // kiểm tra email
      const email = emailRef.current;
      const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

      if (!regex.test(email)) {
        message.error("Email không hợp lệ )!");
        return;
      }
      // set loading, tránh việc gửi liên tục
      setIsSending(true);

      // tiến hành gửi mã
      const result = await accountApi.postSendVerifyCode({ email });
      if (result.status === 200) {
        message.success("Gửi thành công, kiểm tra email");
        setIsSending(false);
      }
    } catch (error) {
      setIsSending(false);
      if (error.response) {
        message.error(error.response.data.message);
      } else {
        message.error("Gửi thất bại, thử lại");
      }
    }
  };

  // xử lý đăng ký
  const onSignUp = async (account) => {
    try {
      setIsSubmitting(true);
      const result = await accountApi.postSignUp({ account });
      if (result.status === 200) {
        setIsSubmitting(false);
        setIsRedirectLogin(true);
        message.success("Đăng ký thành công.", 1);
      }
    } catch (error) {
      setIsSubmitting(false);
      if (error.response) {
        message.error(error.response.data.message);
      } else {
        message.error("Đăng ký thất bại, thử lại");
      }
    }
  };

  // giá trọ khởi tạo cho formik
  const initialValue = {
    email: "",
    verifyCode: "",
    password: "",
    confirmPassword: "",
  };

  // validate form trước submit với yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .required("* Email bạn là gì ?")
      .email("* Email không hợp lệ !"),

    verifyCode: Yup.string()
      .trim()
      .required("* Nhập mã xác nhận")
      .length(MAX_VERIFY_CODE, `* Mã xác nhận có ${MAX_VERIFY_CODE} ký tự`),
    password: Yup.string()
      .trim()
      .required("* Mật khẩu của bạn là gì ?")
      .min(6, "* Mật khẩu ít nhất 6 ký tự")
      .max(20, "* Mật khẩu tối đa 20 ký tự")
      .matches(
        /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
        "Mật khẩu gồm chữ, số, ký tự đặc biệt và ít nhất 1 chữ hoa"
      ),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "* Mật khẩu chưa trùng khớp"
    ),
  });

  // return...
  return (
    <div className="signUp container">
      {/* chuyển đến trang login khi đăng ký thành công */}
      {isRedirectLogin && (
        <Delay wait={DELAY_TIME}>
          <Redirect to={ROUTES.LOGIN} />
        </Delay>
      )}

      <h1 className="signUp-title underline-title m-b-20 m-t-20">
        <b>Đăng ký tài khoản</b>
      </h1>
      <Formik
        initialValues={initialValue}
        validationSchema={validationSchema}
        onSubmit={onSignUp}
      >
        {(formikProps) => {
          emailRef.current = formikProps.values.email;
          const suffixColor = "rgba(0, 0, 0, 0.25)";
          return (
            <Form className="bg-form">
              <Row
                className="input-border"
                gutter={[64, 20]}
                style={{ margin: 0 }}
              >
                {/* Form thông tin đăng ký */}
                <Col className="p-t-8 p-b-0 t-center" span={24}>
                  <Row gutter={[0, 16]}>
                    <Col span={24} className="p-t-20">
                      {/* email field */}
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

                    <Col span={16}>
                      {/* user name field */}
                      <FastField
                        name="verifyCode"
                        component={InputField}
                        className="input-form-common"
                        placeholder="Mã xác nhận *"
                        size="large"
                        suffix={
                          <Tooltip title="Click gửi mã để nhận mã qua email">
                            <InfoCircleOutlined
                              style={{ color: suffixColor }}
                            />
                          </Tooltip>
                        }
                      />
                    </Col>

                    <Col span={8}>
                      <Button
                        className="w-100 verify-btn"
                        type="primary"
                        size="large"
                        onClick={onSendCode}
                        loading={isSending}
                      >
                        Gửi mã
                      </Button>
                    </Col>

                    <Col span={24}>
                      {/* password field */}
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
                      {/* confirm password field */}
                      <FastField
                        name="confirmPassword"
                        component={InputField}
                        className="input-form-common"
                        type="password"
                        placeholder="Xác nhận mật khẩu *"
                        size="large"
                        iconRender={(visible) =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                      />
                    </Col>
                  </Row>
                </Col>

                {/* Button submit */}
                <Col className="p-t-8 p-b-0 t-center" span={24}>
                  <Button
                    className="signUp-submit-btn w-100 font-size-18px font-weight-500"
                    size="large"
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                  >
                    Đăng ký
                  </Button>
                </Col>

                <Col span={24} className="p-b-20 t-center">
                  <div className="or-option " style={{ color: "#acacac" }}>
                    HOẶC
                  </div>
                  <div className="p-tb-12 font-size-18px font-weight-500 pointer">
                    <LoginGoogle
                      className="login-gg m-0-auto "
                      title={
                        windowWidth > 375 ? "Đăng ký với Google" : "Google"
                      }
                    />
                  </div>

                  <div className="m-t-6 font-weight-500">
                    Bạn đã có tài khoản?
                    <Link className="acc" to={ROUTES.LOGIN}>
                      &nbsp;Đăng nhập
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

export default SignUp;
