import React, { useEffect, useState } from "react";
import { Modal, message, Col, Spin, Table } from "antd";
import { formatDate } from "../../helpers";
import adminApi from "../../apis/adminApi";
import {
  DeleteOutlined,
  EditOutlined,
  RightOutlined,
  WarningOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import EditCustomer from "./EditCustomer";
import { Link } from "react-router-dom";
import Helmet from "../../components/Helmet";
import "./index.scss";

const CustomerList = () => {
  const [editModal, setEditModal] = useState({ visible: false, account: {} });
  const [modalDel, setModalDel] = useState({ visible: false, _id: "" });
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let isSubscribe = true;
    const getCustomerList = async () => {
      try {
        setIsLoading(true);
        const response = await adminApi.getCustomerList();
        if (isSubscribe && response) {
          const list = response.data.list.reverse();
          let l = list.filter((animal) => {
            return animal.role === "0";
          });

          const newList = l.map((item, index) => {
            return { ...item, key: index + 1 };
          });

          setData([...newList]);
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
      align: "center",
      title: "Email",
      key: "email",
      dataIndex: "email",
    },
    {
      title: "Loại tài khoản",
      key: "authType",
      align: "center",
      dataIndex: "authType",
      render: (authType) => (authType === "local" ? "Local" : "Google"),
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
      align: "center",
      dataIndex: "isActive",
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
      fixed: "right",
      width: 120,
      render: (text) => (
        <>
          <EditOutlined
            onClick={() => {
              setEditModal({
                visible: true,
                _id: text._id,
                account: { ...text },
              });
            }}
            className="m-r-12 action-btn-product font-size-17px"
            style={{ color: "rgb(15, 255, 0)" }}
          />
          <DeleteOutlined
            onClick={() => setModalDel({ visible: true, _id: text._id })}
            className="action-btn-product font-size-17px"
            style={{ color: "red" }}
          />
        </>
      ),
    },
  ];

  // xoá tài khoản
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

  return (
    <Helmet title={"Quản lý khách hàng"}>
      <>
        <div className="customers">
          <Col span={24} className="p-tb-0">
            <div className="breadcrump">
              <Link to="/dashboard">
                <p className="breadcrump-homeback">Trang chủ</p>
              </Link>
              <span className="p-lr-8">
                <RightOutlined className="breadcrump-arrow" />
              </span>
              <span className="breadcrump-title">Quản lý khách hàng</span>
            </div>
          </Col>

          <div className="customers__title">
            <h2>QUẢN LÝ KHÁCH HÀNG</h2>
          </div>
          {isLoading ? (
            <Spin
              tip="Đang tải danh sách khách hàng..."
              size="large"
              className="trans-center"
            />
          ) : (
            <Table
              columns={columns}
              dataSource={data}
              pagination={{ showLessItems: true, position: ["bottomCenter"] }}
            />
          )}
        </div>

        {/* edit product modal */}
        <EditCustomer
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
            {" "}
            Không thể khôi phục được, bạn có chắc muốn xoá ?
          </b>
        </Modal>
      </>
    </Helmet>
  );
};

export default CustomerList;
