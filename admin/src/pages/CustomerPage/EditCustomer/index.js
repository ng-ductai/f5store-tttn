import React, { useState } from "react";
import { Col, Form, Input, message, Modal, Row, Select } from "antd";
import adminApi from "../../../apis/adminApi";
import { ACTIVE_OPTIONS } from "../../../constants/index";
import PropTypes from "prop-types";

const EditAccountCustomerModal = (props) => {
  const { visible, onClose, account } = props;
  const [isUpdating, setIsUpdating] = useState(false);
  if (!account) {
    return null;
  }

  const { _id, isActive } = account;
  const initValues = { _id, isActive };

  // Sửa thông tin khách hàng
  const onEdit = async (value) => {
    try {
      setIsUpdating(true);
      const response = await adminApi.updateAccountCustomer(value);
      if (response && response.status === 200) {
        setTimeout(() => {
          onClose(value);
        }, 900);
      }
    } catch (error) {
      message.error("Cập nhật thất bại");
      setIsUpdating(false);
    }
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
      title="Chỉnh sửa trạng thái tài khoản"
      confirmLoading={isUpdating}
      width={400}
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

          {/* Trạng thái */}
          <Col span={24}>
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
        </Row>
      </Form>
    </Modal>
  );
};

EditAccountCustomerModal.propTypes = {
  onClose: PropTypes.func,
  account: PropTypes.object,
  visible: PropTypes.bool,
};

export default EditAccountCustomerModal;
