import React, { useState } from "react";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  RightOutlined,
} from "@ant-design/icons";
import { Button, Col, message, Row } from "antd";
import adminApi from "../../../apis/adminApi";
import InputField from "../../../components/Custom/InputField";
import SelectField from "../../../components/Custom/SelectField";
import DatePickerField from "../../../components/Custom/DatePickerField";
import { MIN_AGE, DELAY_TIME, GENDER_OPTIONS } from "../../../constants/index";
import { FastField, Form, Formik } from "formik";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import "./index.scss";

const AddAdmin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const history = useHistory();

  // xử lý đăng ký
  const onSignUp = async (account) => {
    try {
      setIsSubmitting(true);
      const result = await adminApi.postAddAdmin({ account });
      if (result.status === 200) {
        message.success("Thêm tài khoản thành công.", 1);
        setIsSubmitting(false);
        setTimeout(() => {
          history.goBack();
        }, DELAY_TIME);
      }
    } catch (error) {
      setIsSubmitting(false);
      if (error.response) {
        message.error(error.response.data.message);
      } else {
        message.error("Thêm thất bại, thử lại");
      }
    }
  };

  const onGoBack = () => {
    history.goBack();
  };

  // giá trị khởi tạo cho formik
  const initialValue = {
    email: "",
    password: "",
    confirmPassword: "",
    userName: "",
    phone: "",
    fullName: "",
    gender: null,
    birthday: "1970-01-01",
  };

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  // validate form trước submit với yup
  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .trim()
      .required("* Vui lòng nhập họ tên !")
      .matches(
        /^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$/,
        "* Không được chứa ký tự đặc biệt và số, viết hoa chữ cái đầu tiên"
      )
      .max(70, "* Tối đa 70 ký tự"),

    userName: Yup.string()
      .trim()
      .required("* Vui lòng nhập username !")
      .matches(/^[a-zA-Z0-9]*$/g, "* Không được chứa ký tự đặc biệt")
      .min(3, "* Tối thiểu 3 ký tự")
      .max(20, "* Tối đa 20 ký tự"),

    email: Yup.string()
      .trim()
      .required("* Vui lòng nhập email !")
      .email("* Email không hợp lệ !"),

    password: Yup.string()
      .trim()
      .required("* Vui lòng nhập mật khẩu !")
      .min(6, "* Mật khẩu ít nhất 6 ký tự")
      .max(20, "* Mật khẩu tối đa 20 ký tự")
      .matches(
        /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
        "Mật khẩu gồm chữ, số"
      ),

    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "* Mật khẩu chưa trùng khớp"
    ),

    birthday: Yup.date()
      .required("* Vui lòng nhập chọn ngày sinh !")
      .min(new Date(1900, 1, 1), "* Năm sinh từ 1900")
      .max(
        new Date(new Date().getFullYear() - parseInt(MIN_AGE), 1, 1),
        `* Tuổi tối thiểu là ${MIN_AGE}`
      ),

    phone: Yup.string()
      .matches(phoneRegExp, "Số điện thoại không hợp lệ !")
      .required("Vui lòng nhập số điện thoại !")
      .min(10, "* Số điện thoại bao gồm 10 số")
      .max(10, "* Số điện thoại bao gồm 10 số"),

    gender: Yup.boolean().required("* Vui lòng chọn giới tính !"),
  });

  return (
    <div className="AddAdmin">
      <Col span={24} className="p-tb-0">
        <div className="breadcrump">
          <Link to="/dashboard">
            <p className="breadcrump-homeback">Trang chủ</p>
          </Link>
          <span className="p-lr-8">
            <RightOutlined className="breadcrump-arrow" />
          </span>
          <Link to="/admin/all">
            <span className="breadcrump-homeback">Quản lý Admin</span>
          </Link>
          <span className="p-lr-8">
            <RightOutlined className="breadcrump-arrow" />
          </span>
          <span className="breadcrump-title">Thêm mới</span>
        </div>
      </Col>

      <div className="bg-white m-t-6 bor-rad-8">
        <p className="title t-center p-t-12">Thêm tài khoản </p>

        <Formik
          initialValues={initialValue}
          validationSchema={validationSchema}
          onSubmit={onSignUp}
        >
          {(formikProps) => {
            return (
              <Form className="bg-for">
                <Row className="bg-for__main" gutter={[24, 20]}>
                  <Col span={24} md={24} lg={12} className="colForm">
                    {/* email */}
                    <div className="col-item">
                      <label htmlFor="email" className="labelForm">
                        Email
                      </label>
                      <FastField
                        name="email"
                        component={InputField}
                        className="input-form-common"
                        placeholder="VD: admin@gmail.com"
                        size="large"
                      />
                    </div>
                  </Col>

                  <Col span={24} md={24} lg={12} className="colForm">
                    {/* full name */}
                    <div className="col-item">
                      <label htmlFor="fullName" className="labelForm">
                        Họ và tên
                      </label>
                      <FastField
                        name="fullName"
                        component={InputField}
                        className="input-form-common"
                        placeholder="VD: Đức Tài"
                        size="large"
                      />
                    </div>
                  </Col>

                  <Col span={24} md={24} lg={12} className="colForm">
                    {/* password */}
                    <div className="col-item">
                      <label htmlFor="password" className="labelForm">
                        Mật khẩu
                      </label>
                      <FastField
                        name="password"
                        component={InputField}
                        className="input-form-common"
                        type="password"
                        placeholder="Nhập mật khẩu..."
                        size="large"
                        autocomplete="on"
                        iconRender={(visible) =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                      />
                    </div>
                  </Col>

                  <Col span={24} md={24} lg={12} className="colForm">
                    {/* confirm password */}
                    <div className="col-item">
                      <label htmlFor="confirmPassword" className="labelForm">
                        Nhập lại mật khẩu
                      </label>
                      <FastField
                        name="confirmPassword"
                        component={InputField}
                        className="input-form-common"
                        type="password"
                        placeholder="Xác nhận mật khẩu..."
                        size="large"
                        iconRender={(visible) =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                      />
                    </div>
                  </Col>

                  <Col span={24} md={24} lg={12} className="colForm">
                    {/* username */}
                    <div className="col-item">
                      <label htmlFor="userName" className="labelForm">
                        Username
                      </label>
                      <FastField
                        name="userName"
                        component={InputField}
                        className="input-form-common"
                        placeholder="Nhập username..."
                        size="large"
                      />
                    </div>
                  </Col>

                  <Col span={24} md={24} lg={12} className="colForm">
                    {/* full name */}
                    <div className="col-item">
                      <label htmlFor="phone" className="labelForm">
                        Số điện thoại
                      </label>
                      <FastField
                        name="phone"
                        component={InputField}
                        className="input-form-common"
                        placeholder="Số điện thoại..."
                        size="large"
                      />
                    </div>
                  </Col>

                  <Col span={24} md={24} lg={12} className="colForm">
                    {/* gender */}
                    <div className="col-item">
                      <label htmlFor="gender" className="labelForm">
                        Giới tính
                      </label>
                      <FastField
                        className="input-form-common gender-field boder"
                        size="large"
                        name="gender"
                        component={SelectField}
                        placeholder="Chọn giới tính"
                        options={GENDER_OPTIONS}
                      />
                    </div>
                  </Col>

                  <Col span={24} md={24} lg={12} className="colForm">
                    {/* birthday */}
                    <div className="col-item">
                      <label htmlFor="birthday" className="labelForm">
                        Ngày sinh
                      </label>
                      <FastField
                        className="input-form-common"
                        name="birthday"
                        component={DatePickerField}
                        placeholder="Ngày sinh..."
                        size="large"
                      />
                    </div>
                  </Col>
                </Row>

                <div className="submit">
                  <Button
                    className="btn btn2"
                    type="dashed"
                    onClick={onGoBack}
                    size="large"
                  >
                    Hủy
                  </Button>
                  <Button
                    className="btn "
                    type="primary"
                    size="large"
                    htmlType="submit"
                    loading={isSubmitting}
                  >
                    Lưu
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default AddAdmin;
