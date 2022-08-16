import { Button, Col, message, Row } from "antd";
import accountApi from "../../../apis/accountApi";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import InputField from "../../../components/Custom/InputField";
import { FastField, Form, Formik } from "formik";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import * as Yup from "yup";

const UpdatePassword = () => {
  const user = useSelector((state) => state.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { accountId } = user;

  const handleUpdate = async (value, { resetForm }) => {
    try {
      setIsSubmitting(true);
      const response = await accountApi.putUpdatePassword(accountId, value);
      if (response) {
        message.success("Đổi mật khẩu thành công.");
        setIsSubmitting(false);
        resetForm({});
      }
    } catch (error) {
      console.log("errror", error);
      message.error("Cập nhật thất bại. Thử lại", 2);
      setIsSubmitting(false);
    }
  };

  const initialValue = {
    oldPassword: "",
    newPassword: "",
    confirmnewPassword: "",
  };

  // validate form trước submit với yup
  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .trim()
      .required("Mật khẩu hiện tại là gì ?")
      .min(6, "Mật khẩu ít nhất 6 ký tự")
      .max(20, "Mật khẩu tối đa 20 ký tự")
      .matches(
        /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
        "Mật khẩu gồm chữ, số, ký tự đặc biệt và ít nhất 1 chữ hoa"
      ),
    newPassword: Yup.string()
      .trim()
      .required("Nhập mật khẩu mới !")
      .min(6, "Mật khẩu ít nhất 6 ký tự")
      .max(20, "Mật khẩu tối đa 20 ký tự")
      .matches(
        /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
        "Mật khẩu gồm chữ, số, ký tự đặc biệt và ít nhất 1 chữ hoa"
      ),
    confirmnewPassword: Yup.string().oneOf(
      [Yup.ref("newPassword"), null],
      "Mật khẩu chưa trùng khớp !"
    ),
  });

  return (
    <>
      <Formik
        initialValues={initialValue}
        validationSchema={validationSchema}
        onSubmit={handleUpdate}
      >
        {(formikProps) => {
          return (
            <Form className="bg-white borderTop">
              <Row>
                <Col span={24} md={16}>
                  <Row className="update-left" gutter={[32, 16]}>
                    {/* oldPassword filed */}
                    <Col span={24} className="inputRow">
                      <Col className="profile-left_label t-right" span={24} md={8}>
                        <label className="font-size-16px" htmlFor="oldPassword">
                          Mật khẩu hiện tại
                        </label>
                      </Col>
                      <Col className="p-b-0" span={24} md={16}>
                        <FastField
                          name="oldPassword"
                          component={InputField}
                          disabled={false}
                          className="input-form-common"
                          type="password"
                          size="large"
                          autocomplete="on"
                          iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                          }
                        />
                      </Col>
                    </Col>

                    {/* newPassword filed */}
                    <Col span={24} className="inputRow">
                      <Col className="profile-left_label t-right" span={24} md={8}>
                        <label className="font-size-16px" htmlFor="newPassword">
                          Mật khẩu mới
                        </label>
                      </Col>
                      <Col className="p-b-0" span={24} md={16}>
                        <FastField
                          name="newPassword"
                          component={InputField}
                          disabled={false}
                          className="input-form-common"
                          type="password"
                          size="large"
                        />
                      </Col>
                    </Col>

                    {/* confirmnewPassword filed */}
                    <Col span={24} className="inputRow">
                      <Col className="profile-left_label t-right" span={24} md={8}>
                        <label
                          className="font-size-16px"
                          htmlFor="confirmnewPassword"
                        >
                          Xác nhận mật khẩu
                        </label>
                      </Col>
                      <Col className="p-b-0" span={24} md={16}>
                        <FastField
                          name="confirmnewPassword"
                          component={InputField}
                          disabled={false}
                          className="input-form-common"
                          type="password"
                          size="large"
                        />
                      </Col>
                    </Col>
                  </Row>
                </Col>

                <Col span={24} md={8}>
                  <Row className="update-right" gutter={[32, 16]}>
                    <Col className="m-l-16 p-t-10" span={24} md={24}>
                      <div className="font-size-16px font-weight-600">
                        <Link to="/login/forgot-pw">Quên mật khẩu ?</Link>
                      </div>
                    </Col>
                  </Row>
                </Col>

                {/* Button submit */}
                <Col className="p-t-10 p-b-20 t-center" span={24}>
                  <Button
                    className="w-20"
                    size="large"
                    type="primary"
                    loading={isSubmitting}
                    htmlType="submit"
                  >
                    {isSubmitting ? "Đang cập nhật ..." : "Cập nhật"}
                  </Button>
                </Col>
              </Row>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default UpdatePassword;
