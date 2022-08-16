import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Button, Col, message, Row, Tooltip } from "antd";
import InputField from "../../../components/Custom/InputField";
import Delay from "../../../components/Delay";
import { MAX_VERIFY_CODE, DELAY_TIME, ROUTES } from "../../../constants/index";
import { FastField, Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import accountApi from "../../../apis/accountApi";
import * as Yup from "yup";
import "./index.scss";

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const emailRef = useRef("");

  // gửi mã xác nhận
  const onSendCode = async () => {
    try {
      // kiểm tra email
      const email = emailRef.current;
      const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

      if (!regex.test(email)) {
        message.error("Email không hợp lệ !");
        return;
      }
      // set loading, tránh việc gửi liên tục
      setIsSending(true);

      // tiến hành gửi mã
      const result = await accountApi.postSendCodeForgotPW({ email });
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

  // thay đổi mật khẩu
  const onChangePassword = async (account) => {
    try {
      setIsSubmitting(true);
      const result = await accountApi.postResetPassword({ account });
      if (result.status === 200) {
        setIsSubmitting(false);
        setIsSuccess(true);
        message.success("Thay đổi mật khẩu thành công.");
      }
    } catch (error) {
      setIsSubmitting(false);
      if (error.response) {
        message.error(error.response.data.message);
      } else {
        message.error("Cập nhật thất bại. Thử lại");
      }
    }
  };

  // giá trọ khởi tạo cho formik
  const initialValue = {
    email: "",
    password: "",
    verifyCode: "",
  };

  // validate form trước submit với yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .required("* Email bạn là gì ?")
      .email("* Email không hợp lệ !"),
    password: Yup.string().trim().required("* Mật khẩu của bạn là gì ?"),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "* Mật khẩu chưa trùng khớp"
    ),
    verifyCode: Yup.string()
      .trim()
      .required("* Nhập mã xác nhận")
      .length(MAX_VERIFY_CODE, `* Mã xác nhận có ${MAX_VERIFY_CODE} ký tự`),
  });

  return (
    <div className="ForgotPW container">
      {isSuccess && (
        <Delay wait={DELAY_TIME}>
          <Redirect to={ROUTES.LOGIN} />
        </Delay>
      )}

      <h1 className="Login-title p-t-30 m-b-20 underline-title">
        <b>Đặt lại mật khẩu</b>
      </h1>
      <Formik
        initialValues={initialValue}
        validationSchema={validationSchema}
        onSubmit={onChangePassword}
      >
        {(formikProps) => {
          emailRef.current = formikProps.values.email;
          const suffixColor = "rgba(0, 0, 0, 0.25)";
          return (
            <Form className="bg-form">
              <Row
                className="input-border p-l-20 p-r-20"
                gutter={[0, 24]}
                justify="center"
                style={{ margin: 0 }}
              >
                {/* Form thông tin đăng nhập */}
                <Col span={24} className="m-t-20">
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
                    placeholder="Mật khẩu mới *"
                    size="large"
                    autocomplete="on"
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Col>
                <Col span={24}>
                  <FastField
                    name="confirmPassword"
                    component={InputField}
                    className="input-form-common"
                    type="confirmPassword"
                    placeholder="Xác nhận mật khẩu mới *"
                    size="large"
                    autocomplete="on"
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Col>
                <Col span={12}>
                  {/* user name field */}
                  <FastField
                    name="verifyCode"
                    component={InputField}
                    className="input-form-common"
                    placeholder="Mã xác nhận *"
                    size="large"
                    suffix={
                      <Tooltip title="Click gửi mã để nhận mã qua email">
                        <InfoCircleOutlined style={{ color: suffixColor }} />
                      </Tooltip>
                    }
                  />
                </Col>
                <Col span={12}>
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

                {/* Button submit */}
                <Col className="p-t-8 m-b-20 t-center" span={24}>
                  <Button
                    className="ForgotPW-submit-btn w-100"
                    size="large"
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                  >
                    <span
                      className="font-weight-500 font-size-18px"
                      style={{ color: "#fff" }}
                    >
                      Đặt lại mật khẩu
                    </span>
                  </Button>

                  <div className="m-t-20 foot ">
                    <div className="p-lr-5 m-t-2">Tiếp tục với </div>

                    <p className="continue">
                      <Link to={ROUTES.LOGIN}> Đăng nhập</Link>
                    </p>

                    <span className="p-lr-5 m-t-2 "> hoặc</span>

                    <p className="continue">
                      <Link to={ROUTES.SIGNUP}>Đăng ký</Link>
                    </p>
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

export default ForgotPassword;
