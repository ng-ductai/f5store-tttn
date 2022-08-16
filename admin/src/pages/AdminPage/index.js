import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  WarningOutlined,
  CheckOutlined,
  CloseOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Table, Spin, Col, message } from "antd";
import Modal from "antd/lib/modal/Modal";
import { formatDate } from "../../helpers";
import adminApi from "../../apis/adminApi";
import EditAccountAdminModal from "./EditAdmin";
import { Link } from "react-router-dom";
import Helmet from "../../components/Helmet";
import "./index.scss";

const AdminUser = () => {
  const [editModal, setEditModal] = useState({ visible: false, account: null });
  const [modalDel, setModalDel] = useState({ visible: false, _id: "" });
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // xoá sản phẩm
  const onDelete = async (_id) => {
    try {
      const response = await adminApi.delCustomer(_id);
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
  const onCloseEditModal = (newAccount) => {
    const newList = data.map((item) =>
      item._id !== newAccount._id ? item : { ...item, ...newAccount }
    );
    setData(newList);
    setEditModal({ visible: false, account: null });
  };

  const columns = [
    {
      title: "STT",
      key: "key",
      align: "center",
      dataIndex: "key",
    },
    {
      title: "Họ tên",
      align: "center",
      key: "fullName",
      dataIndex: "fullName",
    },
    {
      title: "User name",
      align: "center",
      key: "userName",
      dataIndex: "userName",
    },
    {
      title: "Email",
      align: "center",
      key: "email",
      dataIndex: "email",
    },

    {
      title: "Ngày sinh",
      key: "birthday",
      align: "center",
      dataIndex: "birthday",
      render: (birthday) => formatDate(birthday),
    },
    {
      title: "Giới tính",
      key: "gender",
      align: "center",
      dataIndex: "gender",
      render: (gender) => (gender ? "Nam" : "Nữ"),
    },
    {
      title: "Số điện thoại",
      key: "phone",
      align: "center",
      dataIndex: "phone",
    },
    {
      title: "Trạng thái",
      key: "isActive",
      dataIndex: "isActive",
      align: "center",
      render: (isActive) =>
        isActive ? (
          <CheckOutlined style={{ color: "green" }} />
        ) : (
          <CloseOutlined style={{ color: "red" }} />
        ),
    },
    {
      title: "Hành động",
      key: "actions",
      align: "center",
      width: 120,

      render: (text) => (
        <div className="action">
          {text.email === "ductai2982@gmail.com" ? (
            <>
              <EditOutlined
                onClick={() => {
                  setEditModal({ visible: true, account: { ...text } });
                }}
                className="m-r-12 font-size-17px"
                style={{ color: "rgb(15, 255, 0)" }}
              />
            </>
          ) : (
            <>
              <EditOutlined
                onClick={() => {
                  setEditModal({ visible: true, account: { ...text } });
                }}
                className="m-r-8 font-size-17px"
                style={{ color: "rgb(15, 255, 0)" }}
              />
              <DeleteOutlined
                onClick={() => setModalDel({ visible: true, _id: text._id })}
                className="m-r-8 font-size-17px"
                style={{ color: "red" }}
              />
            </>
          )}
        </div>
      ),
    },
  ];

  // Lấy danh sách admin user
  useEffect(() => {
    let isSubscribe = true;

    const getCustomerList = async () => {
      setIsLoading(true);
      try {
        setIsLoading(true);
        const response = await adminApi.getCustomerList();
        if (response && isSubscribe) {
          const list = response.data.list.reverse();

          let l = list.filter((animal) => {
            return animal.role === "1";
          });

          const listWittKey = l.map((item, index) => {
            return { ...item, key: index + 1 };
          });
          setData(listWittKey);
          setIsLoading(false);
        }
      } catch (error) {
        if (isSubscribe) setIsLoading(false);
      }
    };

    getCustomerList();

    return () => {
      isSubscribe = false;
    };
  }, []);

  return (
    <Helmet title={"Quản lý admin"}>
      <div className="admin">
        <Col span={24} className="p-tb-0">
          <div className="breadcrump">
            <Link to="/dashboard">
              <p className="breadcrump-homeback">Trang chủ</p>
            </Link>
            <span className="p-lr-8">
              <RightOutlined className="breadcrump-arrow" />
            </span>
            <span className="breadcrump-title">Quản lý Admin</span>
          </div>
        </Col>

        <div className="admin__title">
          <h2>QUẢN LÝ ADMIN</h2>
          <Link to="/admin/add">
            <button className="admin__title-add">
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
              pageSize: 8,
              showSizeChanger: false,
              position: ["bottomCenter"],
            }}
            columns={columns}
            dataSource={data}
          />
        )}

        {/* edit product modal */}
        <EditAccountAdminModal
          visible={editModal.visible}
          onClose={(value) => onCloseEditModal(value)}
          account={editModal.account}
        />

        {/* modal confirm delete product */}
        <Modal
          title="Xác nhận xoá sản phẩm"
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

export default AdminUser;
