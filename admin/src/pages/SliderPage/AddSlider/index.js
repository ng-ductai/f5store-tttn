import React, { useState } from "react";
import { RightOutlined } from "@ant-design/icons";
import { Button, Col, message, Row, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import adminApi from "../../../apis/adminApi";
import InputField from "../../../components/Custom/InputField";
import SelectField from "../../../components/Custom/SelectField";
import TextArea from "../../../components/Custom/TextAreaField";
import {
  COMPRESSION_RADIO,
  COMPRESSION_RADIO_PNG,
  ACTIVE_OPTIONS,
  COLORSLIDER_OPTIONS,
} from "../../../constants/index";
import { FastField, Form, Formik } from "formik";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import Compressor from "compressorjs";
import "./index.scss";

const AddSlider = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const history = useHistory();

  // avt file chưa nén
  const [avtFileList, setAvtFileList] = useState([]);
  // avt đã nén
  const [avatar, setAvatar] = useState(null);

  // nén ảnh sản phẩm, type: 0 - avt
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

  // xử lý đăng ký
  const onSignUp = async (data) => {
    if (avatar != null) {
      data.image = avatar;
    }
    try {
      const { title, description, image, path, color, status } = data;
      data.image = avatar;
      setIsSubmitting(true);
      const slider = {
        title,
        description,
        image,
        path,
        color,
        status,
      };

      const result = await adminApi.postAddSlider({ slider });
      if (result.status === 200) {
        message.success("Thêm thành công !", 1);
        setIsSubmitting(false);
        history.goBack();
      }
    } catch (error) {
      setIsSubmitting(false);
      if (error.response) {
        message.error(error.response.data.message);
      } else {
        message.error("Thất bại, thử lại !!!");
      }
    }
  };

  // giá trị khởi tạo cho formik
  const initialValue = {
    title: "",
    description: "",
    image: "",
    path: "",
    color: "",
    status: true,
  };

  // validate form trước submit với yup
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .trim()
      .required("* Vui lòng nhập tiêu đề !")
      .max(70, "* Tối đa 70 ký tự"),

    description: Yup.string()
      .trim()
      .required("* Vui lòng nhập mô tả !")
      .max(500, "* Tối đa 500 ký tự"),

    color: Yup.string().required("* Vui lòng chọn màu sắc !"),
    status: Yup.boolean().required("* Vui lòng chọn trạng thái !"),
  });

  return (
    <div className="AddSlider">
      <Col span={24} className="p-tb-0">
        <div className="breadcrump">
          <Link to="/dashboard">
            <p className="breadcrump-homeback">Trang chủ</p>
          </Link>
          <span className="p-lr-8">
            <RightOutlined className="font-size-12px" />
          </span>

          <Link to="/sliders/all">
            <p className="breadcrump-homeback">Slider</p>
          </Link>

          <span className="p-lr-8">
            <RightOutlined className="font-size-12px" />
          </span>
          <span className="font-size-16px">Thêm mới</span>
        </div>
      </Col>

      <div className="bg-white m-t-6 bor-rad-8">
        <p className="title t-center p-t-12">Thêm Slider</p>
        <Formik
          initialValues={initialValue}
          validationSchema={validationSchema}
          onSubmit={onSignUp}
        >
          {(formikProps) => {
            return (
              <Form className="bg-for">
                <Row className="bg-for__main" gutter={[24, 20]}>
                  <Col span={24} md={24} lg={14} className="colForm">
                    {/* title */}
                    <div className="col-item">
                      <label htmlFor="title" className="labelForm p-b-6">
                        Tiêu đề
                      </label>
                      <FastField
                        name="title"
                        component={InputField}
                        className="input-form-common"
                        placeholder="Nhập tiêu đề..."
                        size="large"
                      />
                    </div>
                  </Col>

                  <Col span={24} md={24} lg={10} className="colForm">
                    {/* color */}
                    <div className="col-item">
                      <label htmlFor="color" className="labelForm p-b-6">
                        Màu sắc
                      </label>
                      <FastField
                        className="input-form-common gender-field boder"
                        size="large"
                        name="color"
                        component={SelectField}
                        placeholder="Chọn màu sắc"
                        options={COLORSLIDER_OPTIONS}
                      />
                    </div>
                  </Col>

                  <Col span={24} md={24} lg={14} className="colForm">
                    {/* Đường dẫn */}
                    <div className="col-item">
                      <label htmlFor="path" className="labelForm p-b-6">
                        Đường dẫn
                      </label>
                      <FastField
                        name="path"
                        component={InputField}
                        className="input-form-common"
                        placeholder="Nhập đường dẫn..."
                        size="large"
                      />
                    </div>
                  </Col>

                  <Col span={24} md={24} lg={10} className="colForm">
                    {/* status */}
                    <div className="col-item">
                      <label htmlFor="status" className="labelForm p-b-6">
                        Trạng thái
                      </label>
                      <FastField
                        className="input-form-common gender-field boder"
                        size="large"
                        name="status"
                        component={SelectField}
                        placeholder="Chọn trạng thái"
                        options={ACTIVE_OPTIONS}
                      />
                    </div>
                  </Col>

                  <Col span={24} md={24} lg={14} className="colForm">
                    {/* mô tả */}
                    <div className="col-item d-flex flex-direction-column">
                      <label htmlFor="description" className="labelForm p-b-6">
                        Mô tả
                      </label>
                      <FastField
                        name="description"
                        size="large"
                        component={TextArea}
                        className="input-form-common "
                        placeholder="Nhập mô tả..."
                      />
                    </div>
                  </Col>

                  {/* hình ảnh */}
                  <Col span={12} md={24} lg={10} className="colForm2">
                    <div className="col-item d-flex flex-direction-column">
                      <label htmlFor="image" className="labelForm p-b-6">
                        Hình ảnh
                      </label>

                      <Upload
                        listType="picture"
                        fileList={avtFileList}
                        onChange={({ fileList }) => {
                          if (avtFileList.length < 1) setAvtFileList(fileList);
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
                          className="w-100 h-100"
                          icon={<UploadOutlined />}
                        >
                          Upload
                        </Button>
                      </Upload>
                    </div>
                  </Col>
                </Row>

                <div className="submit">
                  <Button className="btn btn1" type="default" size="large">
                    Hủy
                  </Button>
                  <Button
                    className="btn"
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

export default AddSlider;
