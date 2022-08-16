import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  RightOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { message, Row, Col, Spin, Table, Tooltip } from "antd";
import { Link } from "react-router-dom";
import Modal from "antd/lib/modal/Modal";
import adminApi from "../../apis/adminApi";
import productApi from "../../apis/productApi";
import {
  formatProductPrice,
  convertProductType,
  convertProductBrands,
  convertProductBrandi,
  convertProductBrand,
} from "../../helpers";
import Helmet from "../../components/Helmet";
import "./index.scss";

const generateFilterType = () => {
  let result = [];
  for (let i = 0; i < 3; ++i) {
    result.push({ value: i, text: convertProductType(i) });
  }
  return result;
};

const generateFilteBrands = () => {
  let result = [];
  for (let i = 0; i < 13; ++i) {
    result.push({
      value: convertProductBrandi(i),
      text: convertProductBrand(i),
    });
  }
  return result;
};

const Product = () => {
  const [modalDel, setModalDel] = useState({ visible: false, _id: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // xoá sản phẩm
  const onDelete = async (_id) => {
    try {
      const response = await adminApi.removeProduct(_id);
      if (response && response.status === 200) {
        message.success("Xoá thành công.");
        const newList = list.filter((item) => item._id !== _id);
        setList(newList);
      }
    } catch (error) {
      message.error("Xoá thất bại, thử lại !");
    }
  };

  // Lấy toàn bộ danh sách sản phẩm
  useEffect(() => {
    let isSubscribe = true;
    setIsLoading(true);
    const getProductList = async () => {
      try {
        const response = await productApi.getAllProducts(-1);
        if (response && isSubscribe) {
          const data = response.data.data.reverse();
          const list = data.map((item, index) => {
            return { ...item, key: index + 1 };
          });
          console.log("a", list);
          setList(list);
          setIsLoading(false);
        }
      } catch (error) {
        if (isSubscribe) setIsLoading(false);
        message.error("Lấy danh sách sản phẩm thất bại.");
      }
    };
    getProductList();

    return () => {
      isSubscribe = false;
    };
  }, []);

  // Cột của bảng
  const columns = [
    {
      title: "STT",
      key: "key",
      dataIndex: "key",
      align: "center",
    },
    {
      title: "Hình ảnh",
      key: "avt",
      align: "center",
      dataIndex: "avt",
      render: (avt) => <img style={{ width: 70 }} src={avt} alt="" />,
    },
    {
      title: "Tên",
      key: "name",
      dataIndex: "name",
      width: 280,
      render: (name) => (
        <Tooltip title={name}>
          <p className="nameProduct ">{name}</p>
        </Tooltip>
      ),
    },
    {
      title: "Giá",
      align: "center",
      key: "price",
      dataIndex: "price",
      sorter: (a, b) => {
        if (a.price < b.price) return -1;
        if (a.price > b.price) return 1;
        return 0;
      },
      render: (price) => (
        <h4>{price ? formatProductPrice(price) : "Đang cập nhật"}</h4>
      ),
    },
    {
      title: "Loại",
      align: "center",
      key: "type",
      dataIndex: "type",
      filters: generateFilterType(),
      onFilter: (value, record) => record.type === value,
      render: (type) => convertProductType(type),
    },
    {
      title: "Thương hiệu",
      key: "brand",
      align: "center",
      width: 140,
      dataIndex: "brand",
      className: "center",
      filters: generateFilteBrands(),
      onFilter: (value, record) => record.brand === value,
      render: (brand) => convertProductBrands(brand),
    },
    {
      title: "Kho",
      align: "center",
      key: "stock",
      className: "center",
      dataIndex: "stock",
      sorter: (a, b) => {
        if (a.stock < b.stock) return -1;
        if (a.stock > b.stock) return 1;
        return 0;
      },
    },
    {
      title: "Giảm giá",
      key: "discount",
      align: "center",
      className: "center",
      dataIndex: "discount",
      sorter: (a, b) => {
        if (a.discount < b.discount) return -1;
        if (a.discount > b.discount) return 1;
        return 0;
      },
      render: (discount) => `${discount} %`,
    },
    {
      title: "Đã bán",
      align: "center",
      key: "sold",
      className: "center",
      dataIndex: "sold",
      sorter: (a, b) => {
        if (a.sold < b.sold) return -1;
        if (a.sold > b.sold) return 1;
        return 0;
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      className: "center",
      fixed: "right",
      width: 95,
      render: (text) => (
        <>
          <Link to={`/product/${text._id}`}>
            <EditOutlined
              className="m-r-12 action-btn-product font-size-18px"
              style={{ color: "rgb(15, 255, 0)" }}
            />
          </Link>

          <DeleteOutlined
            onClick={() => setModalDel({ visible: true, _id: text._id })}
            className="action-btn-product font-size-18px"
            style={{ color: "red" }}
          />
        </>
      ),
    },
  ];

  return (
    <Helmet title={"Quản lý sản phẩm"}>
      <div className="product">
        <Row>
          {/* Hiển thị đường dẫn trang */}
          <Col span={24} className="p-tb-0">
            <div className="breadcrump">
              <Link to="/dashboard">
                <p className="breadcrump-homeback">Trang chủ</p>
              </Link>
              <span className="p-lr-8">
                <RightOutlined className="breadcrump-arrow" />
              </span>
              <span className="breadcrump-title">Quản lý sản phẩm</span>
            </div>
          </Col>
        </Row>
        <div className="product__title">
          <h2>QUẢN LÝ SẢN PHẨM</h2>
          <Link to="/product/add">
            <button className="product__title-add">
              <i className="fas fa-plus icon"></i>
              <span>Thêm mới</span>
            </button>
          </Link>
        </div>

        <div className="pos-relative p-tb-8">
          {isLoading ? (
            <Spin
              tip="Đang tải danh sách sản phẩm ..."
              size="large"
              className="trans-center"
            />
          ) : (
            <>
              {/* table show product list */}
              <Table
                pagination={{
                  pageSize: 6,
                  position: ["bottomCenter"],
                  showSizeChanger: false,
                }}
                columns={columns}
                dataSource={list}
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
                <div className="delete d-flex align-i-center">
                  <WarningOutlined
                    className="p-r-12"
                    style={{ fontSize: 28, color: "#F7B217" }}
                  />
                  <p className="font-size-18px">
                    Không thể khôi phục được, bạn có chắc muốn xoá ?
                  </p>
                </div>
              </Modal>
            </>
          )}
        </div>
      </div>
    </Helmet>
  );
};

export default Product;
