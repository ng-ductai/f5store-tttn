import React from "react";
import {
  COLOR_CODE,
  CHARGER_CAPACITY,
  CHARGER_CORE,
  CHARGER_TECH,
} from "../../../../constants";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Col, Form, Input, InputNumber, Row, Select, Tooltip } from "antd";

const suffixColor = "#aaa";

const BackupCharger = () => {
  return (
    <Row gutter={[16, 16]}>
      {/* Dung lượng pin */}
      <Col span={12} md={12} xl={6} xxl={4}>
        <Form.Item
          name="capacity"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Dung lượng">
            {CHARGER_CAPACITY.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      {/* Lõi pin */}
      <Col span={12} md={12} xl={6} xxl={4}>
        <Form.Item
          name="core"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Lõi pin">
            {CHARGER_CORE.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      {/* Công nghệ sạc */}
      <Col span={12} md={12} xl={6} xxl={4}>
        <Form.Item
          name="tech"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Công nghệ sạc">
            {CHARGER_TECH.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      {/* Thời gian sạc */}
      <Col span={12} md={12} xl={6} xxl={4}>
        <Form.Item
          name="time"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Thời gian sạc"
            suffix={
              <Tooltip title="10 - 11 giờ (dùng Adapter 1A), 6 - 7 giờ (dùng Adapter 5V - 2A)">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>

      {/* Nguồn */}
      <Col span={12} md={12} xl={6} xxl={4}>
        <Form.Item
          name="voltageIn"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Nguồn vào"
            suffix={
              <Tooltip title="5V/1A">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>

      {/* Nguồn */}
      <Col span={12} md={12} xl={6} xxl={4}>
        <Form.Item
          name="voltageOut"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Nguồn ra"
            suffix={
              <Tooltip title="5V/1A, 2A">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>

      {/* Khối lượng (g) */}
      <Col span={12} md={12} xl={6} xxl={4}>
        <Form.Item
          name="weight"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            step={100}
            size="large"
            min={0}
            max={1000}
            placeholder="Khối lượng (g)"
          />
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

export default BackupCharger;
