import React, { useState } from "react";
import {
  Col,
  Form,
  Input,
  message,
  Modal,
  Upload,
  Button,
  Row,
  Select,
} from "antd";
import {
  COMPRESSION_RADIO,
  COMPRESSION_RADIO_PNG,
  ACTIVE_OPTIONS,
  COLORSLIDER_OPTIONS,
} from "../../../constants/index";
import adminApi from "../../../apis/adminApi";
import PropTypes from "prop-types";
import Compressor from "compressorjs";
import { UploadOutlined } from "@ant-design/icons";

const EditSlideModal = (props) => {
  const { visible, onClose, slide } = props;
  const [isUpdating, setIsUpdating] = useState(false);

  // avt file chưa nén
  const [avtFileList, setAvtFileList] = useState([]);
  // avt đã nén
  const [avatar, setAvatar] = useState(null);

  if (!slide) {
    return null;
  }
  const { _id, title, description, color, image, path, status } = slide;
  const initValues = { _id, title, description, color, image, path, status };

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

  // Sửa chữa sản phẩm
  const onEdit = async (value) => {
    if (avatar != null) {
      value.image = avatar;
    }
    try {
      setIsUpdating(true);
      const response = await adminApi.updateSlider(value);
      if (response && response.status === 200) {
        setTimeout(() => {
          onClose(value);
        }, 800);
      }
    } catch (error) {
      message.error("Cập nhật thất bại");
    }
    setIsUpdating(false);
  };

  return (
    <Modal
      className="edit-product-modal"
      destroyOnClose={false}
      maskClosable={false}
      visible={visible}
      okText="Cập nhật"
      cancelText="Huỷ bỏ"
      onCancel={onClose}
      okButtonProps={{ form: "editForm", htmlType: "submit" }}
      title="Sửa thông tin"
      confirmLoading={isUpdating}
      width={1000}
      centered
    >
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
        <Row gutter={[8, 16]}>
          {/* ID */}
          <Col span={12} className="disable">
            <Form.Item
              label="ID"
              name="_id"
              rules={[
                { required: true, message: "Bắt buộc", whitespace: true },
              ]}
            >
              <Input size="large" placeholder="ID " />
            </Form.Item>
          </Col>

          {/* Tiêu đề */}
          <Col span={12}>
            <Form.Item
              label="Tiêu đề"
              name="title"
              rules={[
                { required: true, message: "Bắt buộc", whitespace: true },
              ]}
            >
              <Input size="large" placeholder="Tiêu đề " />
            </Form.Item>
          </Col>

          {/* Đường dẫn */}
          <Col span={12}>
            <Form.Item
              label="Đường dẫn"
              name="path"
              rules={[
                { required: true, message: "Bắt buộc", whitespace: true },
              ]}
            >
              <Input size="large" placeholder="Đường dẫn " />
            </Form.Item>
          </Col>

          {/* Trạng thái */}
          <Col span={12}>
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: "Bắt buộc" }]}
            >
              <Select size="large" placeholder="Trạng thái">
                {ACTIVE_OPTIONS.map((item, index) => (
                  <Select.Option value={item.value} key={index}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Màu sắc */}
          <Col span={12}>
            <Form.Item
              label="Màu sắc"
              name="color"
              rules={[{ required: true, message: "Bắt buộc" }]}
            >
              <Select size="large" placeholder="Màu sắc">
                {COLORSLIDER_OPTIONS.map((item, index) => (
                  <Select.Option value={item.value} key={index}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Mô tả */}
          <Col span={12}>
            <Form.Item
              label="Mô tả"
              name="description"
              rules={[
                { required: true, message: "Bắt buộc", whitespace: true },
              ]}
            >
              <Input.TextArea size="large" rows={4} placeholder="Mô tả " />
            </Form.Item>
          </Col>

          {/* Hình ảnh */}
          <Col span={24} md={8}>
            <Row
              className=" p-lr-16 m-tb-10 m-lr-40 right-avt"
              gutter={[32, 16]}
            >
              <Col className="p-b-0" span={24} md={24}>
                <img
                  src={image}
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
      </Form>
    </Modal>
  );
};

EditSlideModal.propTypes = {
  onClose: PropTypes.func,
  slide: PropTypes.object,
  visible: PropTypes.bool,
};

export default EditSlideModal;
