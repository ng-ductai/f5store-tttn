import { Button, Col, message, Row, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import userApi from "../../../apis/userApi";
import DatePickerField from "../../../components/Custom/DatePickerField";
import InputField from "../../../components/Custom/InputField";
import SelectField from "../../../components/Custom/SelectField";
import {
  GENDER_OPTIONS,
  MIN_AGE,
  COMPRESSION_RADIO,
  COMPRESSION_RADIO_PNG,
} from "../../../constants/index";
import { FastField, Form, Formik } from "formik";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserRequest } from "../../../reducers/user";
import Compressor from "compressorjs";
import { formatBirthday } from "../../../helpers";
import * as Yup from "yup";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const { _id, fullName, email, userName, gender, phone, avt } = user;
  const birthday = formatBirthday(user.birthday);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  // giá trọ khởi tạo cho formik
  const initialValue = {
    email,
    fullName,
    userName,
    gender,
    birthday,
    phone,
    avt,
  };

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  // validate form trước submit với yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .required("* Email bạn là gì ?")
      .email("* Email không hợp lệ !"),
    userName: Yup.string()
      .trim()
      .required("* Tên bạn là gì ?")
      .matches(/^[a-zA-Z0-9]*$/g, "* Không được chứa ký tự đặc biệt")
      .min(3, "* Tối thiểu 3 ký tự")
      .max(20, "* Tối đa 20 ký tự"),
    fullName: Yup.string()
      .trim()
      .required("* Tên bạn là gì ?")
      .matches(
        /^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$/,
        "* Không được chứa ký tự đặc biệt"
      )
      .max(30, "* Tối đa 30 ký tự"),
    birthday: Yup.date()
      .notRequired()
      .min(new Date(1900, 1, 1), "* Năm sinh từ 1900")
      .max(
        new Date(new Date().getFullYear() - parseInt(MIN_AGE), 1, 1),
        `* Tuổi tối thiểu là ${MIN_AGE}`
      ),
    gender: Yup.boolean().required("* Giới tính của bạn"),
    phone: Yup.string()
      .matches(phoneRegExp, "Số điện thoại không hợp lệ !")
      .required("Nhập số điện thoại của bạn")
      .min(10, "* Số điện thoại bao gồm 10 số")
      .max(10, "* Số điện thoại bao gồm 10 số"),
  });

  // avt file chưa nén
  const [avtFileList, setAvtFileList] = useState([]);

  // avt đã nén
  const [avatar, setAvatar] = useState(null);

  // nén ảnh sản phẩm, type: 0 - avt, type: 1 - picture List
  const onCompressFile = async (file, type = 0) => {
    new Compressor(file, {
      quality: COMPRESSION_RADIO,
      convertSize: COMPRESSION_RADIO_PNG,
      success(fileCompressed) {
        const reader = new FileReader();
        reader.readAsDataURL(fileCompressed);
        reader.onloadend = async () => {
          if (type === 0) setAvatar(reader.result);
        };
      },
      error(err) {
        message.error("Lỗi: ", err);
      },
    });
  };

  // update account
  const handleUpdate = async (value) => {
    if (avatar != null) {
      value.avt = avatar;
    }

    try {
      setIsSubmitting(true);
      if (JSON.stringify(initialValue) === JSON.stringify(value)) {
        setIsSubmitting(false);
        return;
      }
      const response = await userApi.putUpdateUser(_id, value);
      if (response) {
        setIsSubmitting(false);
        setAvtFileList([]);
        setAvatar(null);
        setTimeout(() => {
          dispatch(getUserRequest());
        }, 500);
      }
    } catch (error) {
      message.error("Cập nhật thất bại. Thử lại", 2);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {email && (
        <Formik
          initialValues={initialValue}
          validationSchema={validationSchema}
          onSubmit={(value) => handleUpdate(value)}
        >
          {(formikProps) => {
            return (
              <Form className="borderTop bg-white">
                <Row>
                  <Col span={24} md={16}>
                    <Row className="profile-left" gutter={[32, 16]}>
                      {/* email filed */}
                      <Col
                        span={24}
                        className="inputRow"
                      >
                        <Col className="profile-left_label t-right" span={24} md={7} lg={6} >
                          <label className="font-size-16px" htmlFor="email">
                            Email
                          </label>
                        </Col>
                        <Col className="p-b-0" span={24} md={17} lg={18}>
                          <FastField
                            name="email"
                            component={InputField}
                            disabled={true}
                            className="input-form-common"
                            placeholder="Email *"
                            size="large"
                          />
                        </Col>
                      </Col>

                      {/* username filed */}
                      <Col
                        span={24}
                        className="inputRow"
                      >
                        <Col className="profile-left_label t-right" span={24} md={7} lg={6}>
                          <label className="font-size-16px" htmlFor="userName">
                            Tên đăng nhập
                          </label>
                        </Col>
                        <Col className="p-b-0" span={24} md={17} lg={18}>
                          <FastField
                            name="userName"
                            component={InputField}
                            className="input-form-common"
                            placeholder="User name"
                            size="large"
                          />
                        </Col>
                      </Col>

                      {/* full name filed */}
                      <Col
                        span={24}
                        className="inputRow"
                      >
                        <Col className="profile-left_label t-right" span={24} md={7} lg={6}>
                          <label className="font-size-16px" htmlFor="fullName">
                            Họ và tên
                          </label>
                        </Col>
                        <Col className="p-b-0" span={24} md={17} lg={18}>
                          <FastField
                            name="fullName"
                            component={InputField}
                            className="input-form-common"
                            placeholder="Họ và tên *"
                            size="large"
                          />
                        </Col>
                      </Col>

                      {/* gender field */}
                      <Col
                        span={24}
                        className="inputRow"
                      >
                        <Col className="profile-left_label t-right" span={24} md={7} lg={6}>
                          <label className="font-size-16px" htmlFor="gender">
                            Giới tính
                          </label>
                        </Col>
                        <Col className="p-b-0" span={24} md={17} lg={18}>
                          <FastField
                            className="input-form-common gender-field boder"
                            size="large"
                            name="gender"
                            component={SelectField}
                            placeholder="Giới tính *"
                            options={GENDER_OPTIONS}
                          />
                        </Col>
                      </Col>

                      {/* birthday field */}
                      <Col
                        span={24}
                        className="inputRow"
                      >
                        <Col className="profile-left_label t-right" span={24} md={7} lg={6}>
                          <label className="font-size-16px" htmlFor="birthday">
                            Ngày sinh
                          </label>
                        </Col>
                        <Col className="p-b-0" span={24} md={17} lg={18}>
                          <FastField
                            className="input-form-common"
                            name="birthday"
                            component={DatePickerField}
                            placeholder={birthday}
                            size="large"
                          />
                        </Col>
                      </Col>

                      {/* full name filed */}
                      <Col
                        span={24}
                        className="inputRow"
                      >
                        <Col className="profile-left_label t-right" span={24} md={7} lg={6}>
                          <label className="font-size-16px" htmlFor="phone">
                            Số điện thoại
                          </label>
                        </Col>
                        <Col className="p-b-0" span={24} md={17} lg={18}>
                          <FastField
                            name="phone"
                            component={InputField}
                            className="input-form-common"
                            placeholder="Số điện thoại..."
                            size="large"
                          />
                        </Col>
                      </Col>
                    </Row>
                  </Col>

                  <Col span={24} md={8}>
                    <Row className="profile-right m-l-12">
                      <Col className="p-b-0" span={24} md={24}>
                        <img src={avt} className="avt-r" alt="avt" />
                      </Col>
                      <Col span={24} md={24}>
                        <Upload
                          listType="picture"
                          fileList={avtFileList}
                          onChange={({ fileList }) => {
                            if (avtFileList.length < 1)
                              setAvtFileList(fileList);
                          }}
                          onRemove={() => {
                            setAvatar(null);
                            setAvtFileList([]);
                          }}
                          beforeUpload={(file) => {
                            onCompressFile(file, 0);
                            return false;
                          }}
                        >
                          <Button
                            disabled={avatar !== null ? true : false}
                            className="w-100 h-100 upload t-center"
                            icon={<UploadOutlined />}
                          >
                            Upload 
                          </Button>
                        </Upload>
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
      )}
    </>
  );
};

export default Profile;
