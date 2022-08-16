import React from "react";
import {
  COLOR_CODE,
  HEADPHONE_TYPES,
  CONNECTION_STD,
  CHARGER_TYPE,
} from "../../../../constants";
import { Col, Form, Row, Select } from "antd";

const Headphone = () => {
  return (
    <Row gutter={[16, 16]}>
      {/* Loại tai nghe */}
      <Col span={12} md={12} xl={6} xxl={4}>
        <Form.Item
          name="type"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Loại tai nghe">
            {HEADPHONE_TYPES.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      {/* Chuẩn kết nối  */}
      <Col span={12} md={12} xl={6} xxl={4}>
        <Form.Item
          name="connectionStd"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Chuẩn kết nối">
            {CONNECTION_STD.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      {/* Cổng sạc  */}
      <Col span={12} md={12} xl={6} xxl={4}>
        <Form.Item
          name="charger"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Cổng sạc">
            {CHARGER_TYPE.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      {/* Màu sắc */}
      <Col span={12} md={12} xl={6} xxl={4}>
        <Form.Item
          name="color"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Màu sắc ">
            {COLOR_CODE.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>
  );
};

export default Headphone;
