import React, { useState, useEffect } from "react";
import {
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Tooltip,
  message,
  Upload,
  Button,
} from "antd";
import { InfoCircleOutlined, UploadOutlined } from "@ant-design/icons";
import {
  COMPRESSION_RADIO,
  COMPRESSION_RADIO_PNG,
  COLOR_CODE,
  PRODUCT_TYPES,
  BRANDS_TYPES,
} from "../../../../constants";
import Compressor from "compressorjs";
import { useHistory } from "react-router-dom";
import adminApi from "../../../../apis/adminApi";

const suffixColor = "#aaa";

const Mobile = (props) => {
  const { product, productDetail } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const history = useHistory();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { _id, name, code, brand, discount, price, stock, sold, avt, type } =
    product;

  const {
    cameras,
    color,
    cpu,
    displaySize,
    operating,
    pin,
    ram,
    resolution,
    rom,
    warranty,
  } = productDetail;
  const { before, after } = cameras;

  const initValues = {
    _id,
    name,
    code,
    brand,
    discount,
    price,
    stock,
    sold,
    avt,
    type,
    before,
    after,
    color,
    cpu,
    displaySize,
    operating,
    pin,
    ram,
    resolution,
    rom,
    warranty,
  };

  const [avtFileList, setAvtFileList] = useState([]);
  const [avatar, setAvatar] = useState(null);

  /*   // danh sách hình ảnh sp chưa nén
  const [fileList, setFileList] = useState([]);
  console.log("fileList", fileList);
  // danh sách hình ảnh sp đã nén
  const fileCompressedList = useRef([]);
  console.log("fileCompressedList", fileCompressedList); */

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
          /* else if (fileCompressedList.current.length < 10)
            fileCompressedList.current.push({
              data: reader.result,
              uid: file.uid,
            }); */
        };
      },
      error(err) {
        message.error("Lỗi: ", err);
      },
    });
  };

  // Quay lại
  const onGoBack = () => {
    history.goBack();
  };

  // Sửa chữa sản phẩm
  const onEdit = async (value) => {
    if (avatar != null) {
      value.avt = avatar;
    }
    console.log("a", value);
    if (avatar === null) {
      value.avt = avt;
    }

    try {
      setIsSubmitting(true);
      const {
        _id,
        code,
        type,
        discount,
        name,
        price,
        brand,
        stock,
        sold,
        avt,
        ...rest
      } = value;
      console.log("b", value);

      const product = {
        _id,
        code,
        type,
        discount,
        name,
        price,
        brand,
        stock,
        sold,
        avt,
      };

      const details = {
        ...rest,
      };

      const products = { product, details };

      console.log("re", products);

      const response = await adminApi.updateProduct(products);
      if (response && response.status === 200) {
        message.success("Cập nhật thành công");
        history.goBack();
      }
    } catch (error) {
      console.log("e", error);
      message.error("Cập nhật thất bại !");
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <Form
        initialValues={initValues}
        name="editForm"
        onFinish={(value) => onEdit(value)}
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 16,
        }}
        layout="horizontal"
      >
        <Row>
          <Col span={24} md={24} lg={12}>
            <h2 className="t-center font-size-24px p-b-10"> Thông tin chung</h2>
            <Row gutter={[16, 16]}>
              {/* ID */}
              <Col span={24} className="disable">
                <Form.Item label="ID" name="_id">
                  <Input size="large" placeholder="ID " />
                </Form.Item>
              </Col>

              {/* Mã sản phẩm */}
              <Col span={24} className="disable">
                <Form.Item label="Mã sản phẩm" name="code">
                  <Input size="large" placeholder="Mã sản phẩm " />
                </Form.Item>
              </Col>

              {/* Loại sản phẩm */}
              <Col span={24} className="disable">
                <Form.Item
                  label="Thuộc loại"
                  name="type"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <Select size="large" placeholder="Loại sản phẩm ">
                    {PRODUCT_TYPES.map((item, index) => (
                      <Select.Option value={item.type} key={index}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* Tên sản phẩm */}
              <Col span={24}>
                <Form.Item label="Tên sản phẩm" name="name">
                  <Input size="large" placeholder="Tên sản phẩm " />
                </Form.Item>
              </Col>

              {/* Giá sản phẩm */}
              <Col span={24}>
                <Form.Item label="Giá sản phẩm" name="price">
                  <InputNumber
                    min={0}
                    max={9000000000}
                    step={100000}
                    className="w-100"
                    size="large"
                    placeholder="Giá sản phẩm "
                  />
                </Form.Item>
              </Col>

              {/* Thương hiệu */}
              <Col span={24}>
                <Form.Item label="Thương hiệu" name="brand">
                  <Select size="large" placeholder="Thương hiệu ">
                    {BRANDS_TYPES.map((item, index) => (
                      <Select.Option value={item.type} key={index}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* Mức giảm giá */}
              <Col span={24}>
                <Form.Item label="Khuyến mãi (%)" name="discount">
                  <InputNumber
                    style={{ width: "100%" }}
                    step={1}
                    size="large"
                    min={0}
                    max={100}
                    placeholder="Mức giảm giá "
                  />
                </Form.Item>
              </Col>

              {/* Tồn kho */}
              <Col span={24}>
                <Form.Item label="Tồn kho" name="stock">
                  <InputNumber
                    style={{ width: "100%" }}
                    step={1}
                    size="large"
                    min={0}
                    max={100000}
                    placeholder="Tồn kho "
                  />
                </Form.Item>
              </Col>

              {/* Đã bán */}
              <Col span={24}>
                <Form.Item label="Đã bán" name="sold">
                  <InputNumber
                    style={{ width: "100%" }}
                    step={1}
                    size="large"
                    min={0}
                    max={100000}
                    placeholder="Đã bán"
                  />
                </Form.Item>
              </Col>

              {/* Màu sắc */}
              <Col span={24} md={24}>
                <Form.Item name="color" label="Màu sắc">
                  <Select size="large" placeholder="Màu sắc ">
                    {COLOR_CODE.map((item, index) => (
                      <Select.Option value={item.type} key={index}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* Bảo hành */}
              <Col span={24}>
                <Form.Item label="Bảo hành" name="warranty">
                  <InputNumber
                    style={{ width: "100%" }}
                    step={3}
                    size="large"
                    min={0}
                    max={100000}
                    placeholder="Bảo hành"
                  />
                </Form.Item>
              </Col>

              <Col span={24} md={24}>
                <Row
                  className=" p-lr-16 m-tb-10 m-lr-50 right-avt"
                  gutter={[32, 16]}
                >
                  <Col className="p-b-0" span={24} md={24}>
                    <img
                      src={avt}
                      width={100}
                      height={100}
                      alt=""
                      className="avt-r"
                    />
                  </Col>
                  <Col span={24} md={24}>
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
                        className="w-100 h-100 upload"
                        icon={<UploadOutlined />}
                      >
                        Tải ảnh lên
                      </Button>
                    </Upload>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col span={24} md={24} lg={12}>
            <h2 className="t-center font-size-24px p-b-10">
              Thông số kỹ thuật
            </h2>
            <Row gutter={[16, 16]}>
              {/* Màn hình */}
              <Col span={24} md={24}>
                <Form.Item label="Màn hình" name="resolution">
                  <Input
                    size="large"
                    placeholder="Màn hình "
                    suffix={
                      <Tooltip title="6.43'' ">
                        <InfoCircleOutlined style={{ color: suffixColor }} />
                      </Tooltip>
                    }
                  />
                </Form.Item>
              </Col>

              {/* Hệ điều hành */}
              <Col span={24} md={24}>
                <Form.Item label="Hệ điều hành" name="operating">
                  <Input
                    size="large"
                    placeholder="Hệ điều hành "
                    suffix={
                      <Tooltip title="Android 11">
                        <InfoCircleOutlined style={{ color: suffixColor }} />
                      </Tooltip>
                    }
                  />
                </Form.Item>
              </Col>

              {/* Camera trước */}
              <Col span={24} md={24}>
                <Form.Item name="before" label="Camera trước">
                  <Input
                    size="large"
                    placeholder="Camera trước"
                    suffix={
                      <Tooltip title="12MP">
                        <InfoCircleOutlined style={{ color: suffixColor }} />
                      </Tooltip>
                    }
                  />
                </Form.Item>
              </Col>

              {/* Camera sau */}
              <Col span={24} md={24}>
                <Form.Item name="after" label="Camera sau">
                  <Input
                    size="large"
                    placeholder="Camera sau "
                    suffix={
                      <Tooltip title="2 x 12MP">
                        <InfoCircleOutlined style={{ color: suffixColor }} />
                      </Tooltip>
                    }
                  />
                </Form.Item>
              </Col>

              {/* Chip CPU */}
              <Col span={24} md={24}>
                <Form.Item name="cpu" label="Chip">
                  <Input
                    size="large"
                    placeholder="Chip "
                    suffix={
                      <Tooltip title="Snapdragon 695 5G 8 nhân">
                        <InfoCircleOutlined style={{ color: suffixColor }} />
                      </Tooltip>
                    }
                  />
                </Form.Item>
              </Col>

              {/* Độ phân giải */}
              <Col span={24} md={24}>
                <Form.Item name="displaySize" label="Độ phân giải">
                  <Input
                    size="large"
                    placeholder="Độ phân giải "
                    suffix={
                      <Tooltip title="1792 x 828 Pixels">
                        <InfoCircleOutlined style={{ color: suffixColor }} />
                      </Tooltip>
                    }
                  />
                </Form.Item>
              </Col>

              {/* RAM */}
              <Col span={24} md={24}>
                <Form.Item label="RAM" name="ram">
                  <InputNumber
                    style={{ width: "100%" }}
                    step={2}
                    size="large"
                    min={0}
                    max={64}
                    placeholder="RAM (GB) "
                  />
                </Form.Item>
              </Col>

              {/* ROM */}
              <Col span={24} md={24}>
                <Form.Item name="rom" label="ROM">
                  <InputNumber
                    style={{ width: "100%" }}
                    step={16}
                    size="large"
                    min={0}
                    max={1024}
                    placeholder="ROM (GB) "
                  />
                </Form.Item>
              </Col>

              {/* Dung lượng pin */}
              <Col span={24} md={24}>
                <Form.Item label="Dung lượng pin" name="pin">
                  <Input
                    size="large"
                    placeholder="Dung lượng pin "
                    suffix={
                      <Tooltip title="3110 mAh">
                        <InfoCircleOutlined style={{ color: suffixColor }} />
                      </Tooltip>
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* submit button */}
        <Col span={24} className="d-flex justify-content-center p-t-20 p-b-10">
          <Button
            className="m-r-20"
            size="large"
            danger
            type="primary"
            onClick={onGoBack}
          >
            Quay lại
          </Button>
          <Button
            loading={isSubmitting}
            size="large"
            type="primary"
            htmlType="submit"
          >
            Cập nhật
          </Button>
        </Col>
      </Form>
    </>
  );
};

export default Mobile;
