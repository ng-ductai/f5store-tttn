import React from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Col, Form, Input, InputNumber, Row, Select, Tooltip } from "antd";
import { COLOR_CODE } from "../../../../constants";

const suffixColor = "#aaa";

const Mobile = () => {
  return (
    <Row gutter={[16, 16]}>
      {/* Độ phân giải */}
      <Col span={12} md={12} xl={6} xxl={4}>
        <Form.Item
          name="resolution"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
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
      <Col span={12} md={12} xl={6} xxl={4}>
        <Form.Item
          name="operating"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
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
      <Col span={12} md={12} xl={6} xxl={4}>
        <Form.Item name="beforeCamera">
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
      <Col span={12} md={12} xl={6} xxl={4}>
        <Form.Item
          name="afterCamera"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
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
      <Col span={12} md={12} xl={6} xxl={4}>
        <Form.Item
          name="cpu"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
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
      <Col span={12} md={12} xl={6} xxl={4}>
        <Form.Item
          name="displaySize"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
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
      <Col span={12} md={12} xl={6} xxl={4}>
        <Form.Item name="ram" rules={[{ required: true, message: "Bắt buộc" }]}>
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
      <Col span={12} md={12} xl={6} xxl={4}>
        <Form.Item name="rom" rules={[{ required: true, message: "Bắt buộc" }]}>
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

      {/* Dung lượng pin */}
      <Col span={12} md={12} xl={6} xxl={4}>
        <Form.Item
          name="pin"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
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
  );
};

export default Mobile;
