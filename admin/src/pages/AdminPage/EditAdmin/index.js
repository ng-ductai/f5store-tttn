import React, { useState } from "react";
import {
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Upload,
  Button,
} from "antd";
import {
  COMPRESSION_RADIO,
  COMPRESSION_RADIO_PNG,
  GENDER_OPTIONS,
  ACTIVE_OPTIONS,
} from "../../../constants/index";
import adminApi from "../../../apis/adminApi";
import PropTypes from "prop-types";
import Compressor from "compressorjs";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { getUserRequest } from "../../../reducers/user";

const EditAccountAdminModal = (props) => {
  const dispatch = useDispatch();
  const { visible, onClose, account } = props;
  const [isUpdating, setIsUpdating] = useState(false);
  // avt file chưa nén
  const [avtFileList, setAvtFileList] = useState([]);
  // avt đã nén
  const [avatar, setAvatar] = useState(null);

  if (!account) {
    return null;
  }

  const {
    _id,
    email,
    fullName,
    userName,
    birthday,
    phone,
    avt,
    gender,
    isActive,
  } = account;

  const initValues = {
    _id,
    email,
    fullName,
    userName,
    birthday,
    phone,
    gender,
    avt,
    isActive,
  };

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
      value.avt = avatar;
    }

    if (avatar === null) {
      value.avt = avt;
    }

    try {
      setIsUpdating(true);
      const response = await adminApi.updateAccountAdmin(value);

      if (response && response.status === 200) {
        setAvtFileList([]);
        setAvatar(null);
        setTimeout(() => {
          dispatch(getUserRequest());
        }, 800);

        onClose(value);
      }
      console.log(response);
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
      title="Chỉnh sửa thông tin "
      confirmLoading={isUpdating}
      width={900}
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
        <Row gutter={[16, 16]}>
          {/* Id */}
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

          {/* Họ và tên */}
          <Col span={12}>
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[
                { required: true, message: "Bắt buộc", whitespace: true },
              ]}
            >
              <Input size="large" placeholder="Họ và tên " />
            </Form.Item>
          </Col>

          {/* username */}
          <Col span={12}>
            <Form.Item
              label="Username"
              name="userName"
              rules={[
                { required: true, message: "Bắt buộc", whitespace: true },
              ]}
            >
              <Input size="large" placeholder="username " />
            </Form.Item>
          </Col>

          {/* Số điện thoại */}
          <Col span={12}>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Bắt buộc", whitespace: true },
              ]}
            >
              <Input size="large" placeholder="Số điện thoại " />
            </Form.Item>
          </Col>

          {/* Ngày sinh */}
          <Col span={12}>
            <Form.Item
              label="Ngày sinh"
              name="birthday"
              rules={[
                { required: true, message: "Bắt buộc", whitespace: true },
              ]}
            >
              <Input size="large" placeholder="birthday " />
            </Form.Item>
          </Col>

          {/* giới tính */}
          <Col span={12}>
            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: "Bắt buộc" }]}
            >
              <Select size="large" placeholder="Trạng thái">
                {GENDER_OPTIONS.map((item, index) => (
                  <Select.Option value={item.value} key={index}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {email === "ductai2982@gmail.com" ? (
            <>
              {/* Trạng thái */}
              <Col span={12} className="disable">
                <Form.Item
                  label="Trạng thái"
                  name="isActive"
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
            </>
          ) : (
            <>
              {/* Trạng thái */}
              <Col span={12}>
                <Form.Item
                  label="Trạng thái"
                  name="isActive"
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
            </>
          )}
          {/* Hình ảnh */}
          <Col span={24} md={8}>
            <Row
              className=" p-lr-16 m-tb-10 m-lr-40 right-avt"
              gutter={[32, 16]}
            >
              <Col className="p-b-0" span={24} md={24}>
                <img
                  src={avt}
                  width={100}
                  height={100}
                  className="avt-r"
                  alt=""
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
                    console.log("ccc", file);

                    onCompressFile(file, 0);
                    console.log("cc", file);
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

EditAccountAdminModal.propTypes = {
  onClose: PropTypes.func,
  product: PropTypes.object,
  visible: PropTypes.bool,
};

export default EditAccountAdminModal;
