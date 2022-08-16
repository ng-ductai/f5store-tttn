import PropTypes from "prop-types";
import { PlusOutlined } from "@ant-design/icons";
import { Button, message, Spin, Row, Col } from "antd";
import addressApi from "../../../apis/addressApi";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddressAdd from "./AddAddress";
import AddressEdit from "./EditAddress";

const Address = (props) => {
  const { isCheckout, onChecked } = props;
  const [editModal, setEditModal] = useState({ visible: false, address: {} });
  const [isVisibleForm, setIsVisibleForm] = useState(false);
  const [list, setList] = useState([]);
  const [activeItem, setActiveItem] = useState(-1);
  const user = useSelector((state) => state.user);
  const [updateList, setUpdateList] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // cập nhật sản phẩm
  const onCloseEditModal = (value) => {
    const newList = list.map((item) =>
      item._id !== value._id ? item : { ...item, ...value }
    );

    console.log(newList);
    setEditModal({ visible: false, address: null });
  };

  // Lấy danh sách địa chỉ
  useEffect(() => {
    let isSubscribe = true;
    const getDeliveryAddressList = async () => {
      try {
        setIsLoading(true);
        const response = await addressApi.getDeliveryAddressList(user._id);
        if (isSubscribe && response) {
          setList(response.data.list);
          setIsLoading(false);
        }
      } catch (error) {
        if (isSubscribe) {
          setList([]);
          setIsLoading(false);
        }
      }
    };
    if (user) getDeliveryAddressList();
    return () => (isSubscribe = false);
  }, [user, updateList]);

  // xoá 1 địa chỉ giao nhận
  const onDelDeliveryAdd = async (item) => {
    try {
      const response = await addressApi.delDeliveryAddress(user._id, item);
      if (response) {
        setUpdateList(!updateList);
      }
    } catch (error) {
      message.error("Xoá địa chỉ nhận hàng thất bại !");
    }
  };

  // đặt mặc định
  const onSetDefaultDeliveryAdd = async (item) => {
    try {
      const index = { item };
      const response = await addressApi.putSetDefaultDeliveryAddress(
        user._id,
        index
      );

      if (response) {
        setUpdateList(!updateList);
      }
    } catch (error) {
      message.error("Thiết lập địa chỉ mặc định thất bại !");
    }
  };

  // hiển thị danh sách
  const showAddressList = (list = []) => {
    return (
      list &&
      list.map((item, index) => (
        <div
          className={`addressList-item bg-white bor-rad-8 box-sha-home ${
            activeItem === index && isCheckout ? "item-active" : ""
          }`}
          onClick={() => {
            if (isCheckout) {
              setActiveItem(index);
              onChecked(index);
            }
          }}
          key={index}
        >
          <Row>
            <Col span={16} md={18}>
              <div className="addressList-item_row">
                <span className="flex1">Họ và tên </span>
                <div className="flex3">
                  <p className="font-size-16px">{item.name}</p>
                  {index === 0 && !isCheckout && (
                    <span className="flex3_btn bor-rad-4">Mặc định</span>
                  )}
                </div>
              </div>

              <div className="addressList-item_row">
                <span className="flex1"> Số điện thoại</span>
                <span className="flex3"> {item.phone}</span>
              </div>

              <div className="addressList-item_row">
                <span className="flex1"> Địa chỉ </span>
                <span className="flex3"> {item.address}</span>
              </div>
            </Col>

            <Col span={8} md={6}>
              {index !== 0 && !isCheckout ? (
                <div className="addressList-item_btn">
                  <div className="m-b-20">
                    <Button
                      type="primary"
                      disabled={index === 0}
                      onClick={() => {
                        setEditModal({ visible: true, address: { item } });
                      }}
                    >
                      Sửa
                    </Button>
                    <Button
                      className="m-l-20"
                      danger
                      type="primary"
                      disabled={index === 0}
                      onClick={() => onDelDeliveryAdd(index)}
                    >
                      Xoá
                    </Button>
                  </div>
                  <Button
                    type="default"
                    className="font-size-16px"
                    onClick={() => onSetDefaultDeliveryAdd(index)}
                  >
                    Thiết lập mặc định
                  </Button>
                </div>
              ) : (
                <div className="addressList-item_btn">
                  <div className="m-b-20">
                    <Button
                      type="primary"
                      onClick={() => {
                        setEditModal({ visible: true, address: { item } });
                      }}
                    >
                      Sửa
                    </Button>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </div>
      ))
    );
  };

  return (
    <>
      {isLoading ? (
        <div className="t-center m-tb-48">
          <Spin tip="Đang tải danh sách địa chỉ giao hàng ..." size="large" />
        </div>
      ) : (
        <div className="address">
          {/* thêm địa chỉ, chỉ cho tối đa 5 địa chỉ */}
          {list.length < 5 && (
            <Button
              type="dashed"
              size="large"
              className="w-100"
              onClick={() => setIsVisibleForm(true)}
              style={{ height: 50 }}
            >
              <PlusOutlined />
              Thêm địa chỉ
            </Button>
          )}
          {/* hiện danh sách địa chỉ */}
          {list.length > 0 ? (
            <div className="addressList">{showAddressList(list)}</div>
          ) : (
            <h3 className="m-t-16 t-center" style={{ color: "#888" }}>
              Hiện tại bạn chưa có địa chỉ giao, nhận hàng nào
            </h3>
          )}

          {isVisibleForm && (
            <AddressAdd
              onCloseForm={(addFlag) => {
                // flag báo thêm mới địa chỉ thành công để cập nhật lại địa chỉ
                if (addFlag) setUpdateList(!updateList);
                setIsVisibleForm(false);
              }}
            />
          )}

          <AddressEdit
            visible={editModal.visible}
            onClose={() => onCloseEditModal()}
            address={editModal.address}
          />
        </div>
      )}
    </>
  );
};

Address.defaultProps = {
  isCheckout: false,
  onChecked: function () {},
};

Address.propTypes = {
  isCheckout: PropTypes.bool,
  onChecked: PropTypes.func,
};

export default Address;
