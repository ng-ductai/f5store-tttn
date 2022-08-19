import React, { useRef, useState } from "react";
import {
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  RightOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Tooltip,
  Upload,
} from "antd";
import { Link } from "react-router-dom";
import adminApi from "../../../apis/adminApi";
import Compressor from "compressorjs";
import {
  COMPRESSION_RADIO,
  COMPRESSION_RADIO_PNG,
  PRODUCT_TYPES,
  BRANDS_TYPES,
} from "../../../constants/index";
import BackupCharger from "./BackupCharger";
import Headphone from "./Headphone";
import Mobile from "./Mobile";
import ProductDetail from "./ProductDetailModal";
import { useHistory } from "react-router-dom";
import "../index.scss";

const suffixColor = "#aaa";

const AddProduct = () => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTypeSelected, setIsTypeSelected] = useState(false);
  const [typeSelected, setTypeSelected] = useState(-1);
  const productDecs = useRef(null);

  // avt file chưa nén
  const [avtFileList, setAvtFileList] = useState([]);
  // avt đã nén
  const [avatar, setAvatar] = useState(null);
  // danh sách hình ảnh sp chưa nén
  const [fileList, setFileList] = useState([]);
  // danh sách hình ảnh sp đã nén
  const fileCompressedList = useRef([]);

  // xử lý khi chọn loại sản phẩm
  const onProductTypeChange = (value) => {
    if (!isTypeSelected) setIsTypeSelected(true);
    setTypeSelected(value);
  };

  // Render ra component tương ứng khi chọn loại sp
  const onRenderProduct = (value) => {
    switch (value) {
      case 0:
        return <Mobile />;
      case 1:
        return <BackupCharger />;
      case 2:
        return <Headphone />;

      default:
        break;
    }
  };

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
          else if (fileCompressedList.current.length < 10)
            fileCompressedList.current.push({
              data: reader.result,
              uid: file.uid,
            });
        };
      },
      error(err) {
        message.error("Lỗi: ", err);
      },
    });
  };

  // lấy bài viết mô tả sp
  const onGetDetailDesc = (data) => {
    productDecs.current = data;
  };

  // Reset form
  const onResetForm = () => {
    form.resetFields();
    fileCompressedList.current = [];
    setAvtFileList([]);
    setAvatar(null);
    setFileList([]);
  };

  // kiểm tra hình ảnh, bài viết trước submit form
  const onValBeforeSubmit = async (data) => {
    try {
      if (!avatar) {
        message.error("Thêm avatar !", 2);
        return;
      }
      // cảnh báo khi không có bài viết mô tả
      if (productDecs.current === null)
        Modal.confirm({
          title: "Bạn có chắc muốn submit ?",
          content: "Chưa có BÀI VIẾT MÔ TẢ cho sản phẩm này !",
          icon: <ExclamationCircleOutlined />,
          okButtonProps: true,
          onCancel() {
            return;
          },
          onOk() {
            onSubmit(data);
          },
        });
      else if (fileCompressedList.current.length === 0)
        Modal.confirm({
          title: "Bạn có chắc muốn submit ?",
          content: "Chưa có HÌNH ẢNH MÔ TẢ cho sản phẩm này !",
          icon: <ExclamationCircleOutlined />,
          okButtonProps: true,
          onCancel() {
            return;
          },
          onOk() {
            onSubmit(data);
          },
        });
      else onSubmit(data);
    } catch (error) {
      message.error("Có lỗi. Thử lại !");
    }
  };

  // Xử lý submit form
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const { code, name, price, discount, stock, brand, ...rest } = data;
      // các thuộc tính chung của sản phẩm
      const product = {
        type: typeSelected,
        discount,
        code,
        name,
        price,
        brand,
        stock,
        avatar,
      };
      // thuộc tính chi tiết của từng loại sp
      const catalogs = fileCompressedList.current.map((item) => item.data);
      const details = {
        ...rest,
        catalogs,
      };

      // data được gửi đi
      const dataSend = { product, details, desc: productDecs.current };
      const response = await adminApi.postAddProduct(dataSend);
      if (response.status === 200) {
        setIsSubmitting(false);
        message.success("Thêm sản phẩm thành công");
      }
      history.goBack();
    } catch (error) {
      setIsSubmitting(false);
      if (error.response) {
        message.error(error.response.data.message);
      } else {
        message.error("Thêm sản phẩm thất bại. Thử lại");
      }
    }
  };

  return (
    <div className="addProduct">
      <Row>
        {/* Hiển thị đường dẫn trang */}
        <Col span={24} className="p-tb-0">
          <div className="breadcrump">
            <Link to="/dashboard">
              <p className="breadcrump-homeback">Trang chủ</p>
            </Link>
            <span className="p-lr-8">
              <RightOutlined className="breadcrump-arrow" />
            </span>
            <Link to="/products">
              <span className="breadcrump-homeback">
                Quản lý sản phẩm
              </span>
            </Link>
            <span className="p-lr-8">
              <RightOutlined className="breadcrump-arrow" />
            </span>
            <span className="breadcrump-title">Thêm sản phẩm</span>
          </div>
        </Col>
      </Row>

      <h1 className="t-center p-tb-4">
        <b>Thêm sản phẩm</b>
      </h1>

      {/* chọn loại sản phẩm */}
      <Select
        className="m-l-20"
        size="large"
        style={{ width: 250 }}
        onChange={onProductTypeChange}
        placeholder="Chọn loại sản phẩm *"
      >
        {PRODUCT_TYPES.map((item, index) => (
          <Select.Option value={item.type} key={index}>
            {item.label}
          </Select.Option>
        ))}
      </Select>

      {/* form thông tin sản phẩm */}
      {isTypeSelected && (
        <div className="addProduct-main">
          <Form
            name="form"
            form={form}
            onFinish={onValBeforeSubmit}
            onFinishFailed={() => message.error("Lỗi. Kiểm tra lại form")}
          >
            {/* các thông số cơ bản */}
            <Row gutter={[16, 16]}>
              {/* // Note: tổng quan một sản phẩm */}
              <Col span={24}>
                <h2>Thông tin cơ bản sản phẩm</h2>
              </Col>
              {/* mã sản phẩm */}
              <Col span={12} md={12} xl={6} xxl={4}>
                <Form.Item
                  name="code"
                  rules={[
                    { required: true, message: "Bắt buộc", whitespace: true },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Mã sản phẩm *"
                    suffix={
                      <Tooltip title="DTIP0005">
                        <InfoCircleOutlined style={{ color: suffixColor }} />
                      </Tooltip>
                    }
                  />
                </Form.Item>
              </Col>

              {/* tên sản phẩm */}
              <Col span={12} md={12} xl={6} xxl={4}>
                <Form.Item
                  name="name"
                  rules={[
                    { required: true, message: "Bắt buộc", whitespace: true },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Tên sản phẩm *"
                    suffix={
                      <Tooltip title="Điện thoại Samsung Galaxy S22 Ultra 5G">
                        <InfoCircleOutlined style={{ color: suffixColor }} />
                      </Tooltip>
                    }
                  />
                </Form.Item>
              </Col>

              {/* giá sản phẩm */}
              <Col span={12} md={12} xl={6} xxl={4}>
                <Form.Item
                  name="price"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    step={100000}
                    size="large"
                    placeholder="Giá (VNĐ) *"
                    min={0}
                    max={1000000000}
                  />
                </Form.Item>
              </Col>

              {/* số hàng tồn kho */}
              <Col span={12} md={12} xl={6} xxl={4}>
                <Form.Item
                  name="stock"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    step={5}
                    size="large"
                    min={0}
                    max={100000}
                    placeholder="Số lượng hàng trong kho *"
                  />
                </Form.Item>
              </Col>

              {/* thương hiệu */}
              <Col span={12} md={12} xl={6} xxl={4}>
                <Form.Item
                  name="brand"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <Select size="large" placeholder="Thương hiệu ">
                    {BRANDS_TYPES.map((item, index) => (
                      <Select.Option value={item.type} key={index}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/*Thời gian bảo hành*/}
              <Col span={12} md={12} xl={6} xxl={4}>
                <Form.Item
                  name="warranty"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    step={3}
                    size="large"
                    min={0}
                    max={240}
                    placeholder="Thời gian bảo hành (tháng) *"
                  />
                </Form.Item>
              </Col>

              {/*Mức giảm giá*/}
              <Col span={12} md={12} xl={6} xxl={4}>
                <Form.Item
                  name="discount"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    step={5}
                    size="large"
                    min={0}
                    max={90}
                    placeholder="Khuyến mãi (%) *"
                  />
                </Form.Item>
              </Col>

              {/* avatar */}
              <Col span={12} md={12} xl={6} xxl={4}>
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
                    console.log("ccc", file);

                    onCompressFile(file, 0);
                    console.log("cc", file);
                    return false;
                  }}
                >
                  <Button
                    disabled={avatar !== null ? true : false}
                    className="w-100 h-100"
                    icon={<UploadOutlined />}
                  >
                    Upload Avatar
                  </Button>
                </Upload>
              </Col>

              {/* mô tả chi tiết */}
              <ProductDetail onGetDetailDes={onGetDetailDesc} />

              {/* // Note: chi tiết một sản phẩm */}
              {isTypeSelected && (
                <Col span={24}>
                  <h2 className="m-b-10">
                    Thông số kỹ thuật cho&nbsp;
                    <b>{PRODUCT_TYPES[typeSelected].label}</b>
                  </h2>
                  {onRenderProduct(typeSelected)}
                </Col>
              )}

              {/* // Note: hình ảnh sản phẩm */}
              <Col span={24}>
                <h2 className="m-b-10">
                  Hình ảnh của sản phẩm (Tối đa 10 sản phẩm)
                </h2>

                <Upload
                  listType="picture-card"
                  multiple={true}
                  onRemove={(file) => {
                    fileCompressedList.current =
                      fileCompressedList.current.filter(
                        (item) => item.uid !== file.uid
                      );
                  }}
                  fileList={fileList}
                  onChange={({ fileList }) => setFileList(fileList)}
                  beforeUpload={(file) => {
                    onCompressFile(file, 1);
                    return false;
                  }}
                >
                  {fileList.length < 10 && "+ Thêm ảnh"}
                </Upload>
              </Col>

              {/* submit button */}
              <Col span={24} className="d-flex justify-content-end">
                <Button
                  className="m-r-20"
                  size="large"
                  danger
                  type="primary"
                  onClick={onResetForm}
                >
                  Làm mới
                </Button>
                <Button
                  loading={isSubmitting}
                  size="large"
                  type="primary"
                  htmlType="submit"
                >
                  Thêm sản phẩm
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
