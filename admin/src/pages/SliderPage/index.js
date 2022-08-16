import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  RightOutlined,
  WarningOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Table, Col, message, Spin } from "antd";
import Modal from "antd/lib/modal/Modal";
import { convertColor } from "../../helpers";
import adminApi from "../../apis/adminApi";
import EditSlideModal from "./EditSlider";
import { Link } from "react-router-dom";
import Helmet from "../../components/Helmet";
import "./slider.scss";

const Slider = () => {
  const [editModal, setEditModal] = useState({ visible: false, slide: null });
  const [modalDel, setModalDel] = useState({ visible: false, _id: "" });
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // xoá sản phẩm
  const onDelete = async (_id) => {
    try {
      const response = await adminApi.delSlider(_id);
      if (response && response.status === 200) {
        message.success("Xoá thành công.");
        const newList = data.filter((item) => item._id !== _id);
        setData(newList);
      }
    } catch (error) {
      message.error("Xoá thất bại, thử lại !");
    }
  };

  // cập nhật sản phẩm
  const onCloseEditModal = (value) => {
    const newList = data.map((item) =>
      item._id !== value._id ? item : { ...item, ...value }
    );

    setData(newList);
    console.log(newList);
    setEditModal({ visible: false, slide: null });
  };

  const columns = [
    {
      title: "STT",
      key: "key",
      dataIndex: "key",
      align: "center",
    },
    {
      title: "Tiêu đề",
      key: "title",
      width: 250,
      dataIndex: "title",
      render: (title) => <h4 className="titleSlider">{title}</h4>,
    },
    {
      title: "Mô tả",
      key: "description",
      dataIndex: "description",
      width: 350,
      render: (description) => <h4 className="titleSlider">{description}</h4>,
    },

    {
      title: "Hình ảnh",
      key: "image",
      align: "center",
      dataIndex: "image",
      render: (image) => <img style={{ width: 80 }} src={image} alt="" />,
    },
    {
      title: "Đường dẫn",
      align: "center",
      key: "path",
      dataIndex: "path",
      render: (path) => <h4 className="titleSlider">{path}</h4>,
    },
    {
      title: "Màu sắc",
      align: "center",
      width: 120,
      key: "color",
      dataIndex: "color",
      render: (color) => <h4 className="titleSlider">{convertColor(color)}</h4>,
    },
    {
      title: "Trạng thái",
      align: "center",
      width: 120,
      key: "status",
      dataIndex: "status",
      render: (status) =>
        status ? (
          <CheckOutlined style={{ color: "green" }} />
        ) : (
          <CloseOutlined style={{ color: "red" }} />
        ),
    },
    {
      title: "Hành động",
      key: "actions",
      className: "center",
      fixed: "right",
      width: 120,
      render: (text) => (
        <>
          <EditOutlined
            onClick={() => {
              setEditModal({ visible: true, slide: { ...text } });
            }}
            className="m-r-12 action-btn-product font-size-18px"
            style={{ color: "rgb(15, 255, 0)" }}
          />
          <DeleteOutlined
            onClick={() => setModalDel({ visible: true, _id: text._id })}
            className="m-r-8 action-btn-product font-size-18px"
            style={{ color: "red" }}
          />
        </>
      ),
    },
  ];

  // Lấy danh sách slider
  useEffect(() => {
    let isSubscribe = true;

    const getSliderList = async () => {
      try {
        setIsLoading(true);
        const response = await adminApi.getSliderList();
        if (response && isSubscribe) {
          const list = response.data.list.reverse();
          const listWittKey = list.map((item, index) => {
            return { ...item, key: index + 1 };
          });
          setData(listWittKey);
          setIsLoading(false);
        }
      } catch (error) {
        if (isSubscribe) setIsLoading(false);
      }
    };

    getSliderList();

    return () => {
      isSubscribe = false;
    };
  }, []);

  return (
    <Helmet title={"Quản lý slider"}>
      <div className="slider">
        <Col span={24} className="p-tb-0">
          <div className="breadcrump">
            <Link to="/dashboard">
              <p className="breadcrump-homeback">Trang chủ</p>
            </Link>
            <span className="p-lr-8">
              <RightOutlined className="font-size-12px" />
            </span>
            <span className="font-size-16px">Slider</span>
          </div>
        </Col>

        <div className="slider__title">
          <h2>QUẢN LÝ SLIDER</h2>
          <Link to="/sliders/add">
            <button className="slider__title-add">
              <i className="fas fa-plus icon"></i>
              <span>Thêm mới</span>
            </button>
          </Link>
        </div>
        {isLoading ? (
          <Spin
            tip="Đang tải dữ liệu..."
            size="large"
            className="trans-center"
          />
        ) : (
          <Table
            pagination={{
              pageSize: 4,
              showSizeChanger: false,
              position: ["bottomCenter"],
            }}
            columns={columns}
            dataSource={data}
          />
        )}

        {/* edit product modal */}
        <EditSlideModal
          visible={editModal.visible}
          onClose={(value) => onCloseEditModal(value)}
          slide={editModal.slide}
        />

        {/* modal confirm delete product */}
        <Modal
          title="Xác nhận xóa"
          visible={modalDel.visible}
          onOk={() => {
            onDelete(modalDel._id);
            setModalDel({ visible: false, _id: false });
          }}
          onCancel={() => setModalDel({ visible: false, _id: false })}
          okButtonProps={{ danger: true }}
          okText="Xoá"
          cancelText="Huỷ bỏ"
        >
          <WarningOutlined style={{ fontSize: 28, color: "#F7B217" }} />
          <b className="font-size-18px">
            Không thể khôi phục được, bạn có chắc muốn xoá ?
          </b>
        </Modal>
      </div>
    </Helmet>
  );
};

export default Slider;
