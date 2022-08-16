import PropTypes from "prop-types";
import { Spin } from "antd";
import addressApi from "../../apis/addressApi";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddressAddForm from "../../pages/AccountPage/Address/AddAddress";
import { Link } from "react-router-dom";

const AddressUserDefault = (props) => {
  const { isCheckout, onChecked } = props;
  const [isVisibleForm, setIsVisibleForm] = useState(false);
  const [list, setList] = useState([]);
  const [activeItem, setActiveItem] = useState(-1);
  const user = useSelector((state) => state.user);
  const [updateList, setUpdateList] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // hiển thị danh sách
  const showAddressList = (list = []) => {
    return (
      list &&
      list.map((item, index) => (
        <>
          {index === 0 && (
            <div
              className={`d-flex align-i-center bor-rad-8 box-sha-home p-12 m-t-6 ${
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
              <div className="d-flex justify-content-between ">
                <h4 className=" font-size-16px">
                  <b>{item.name}</b>
                </h4>
              </div>

              <div className="d-flex justify-content-between p-l-20">
                <p className=" font-size-16px">
                  <b> {item.phone}</b>
                </p>
              </div>

              <div className="d-flex justify-content-between p-l-30">
                <p className=" font-size-16px">{item.address}</p>
              </div>

              {index === 0 && isCheckout && (
                <div className="d-flex justify-content-between p-l-30">
                  <span
                    className="font-size-16px"
                    style={{
                      color: "#888",
                    }}
                  >
                    Mặc định
                  </span>
                </div>
              )}

              <div className="d-flex justify-content-between m-l-30">
                <Link
                  to="/account/addresses"
                  className=" font-size-16px"
                  style={{
                    color: "#05a",
                  }}
                >
                  THAY ĐỔI
                </Link>
              </div>
            </div>
          )}
        </>
      ))
    );
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
          console.log(response);
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

  return (
    <>
      {isLoading ? (
        <div className="t-center m-tb-48">
          <Spin tip="Đang tải danh sách địa chỉ giao hàng ..." size="large" />
        </div>
      ) : (
        <div className="User-Address-List">
          {/* hiện danh sách địa chỉ */}
          {list.length > 0 ? (
            <div className="address">{showAddressList(list)}</div>
          ) : (
            <h3 className="m-t-16 t-center" style={{ color: "#888" }}>
              Hiện tại bạn chưa có địa chỉ giao, nhận hàng nào
            </h3>
          )}
          {isVisibleForm && (
            <AddressAddForm
              onCloseForm={(addFlag) => {
                // flag báo thêm mới địa chỉ thành công để cập nhật lại địa chỉ
                if (addFlag) setUpdateList(!updateList);
                setIsVisibleForm(false);
              }}
            />
          )}
        </div>
      )}
    </>
  );
};

AddressUserDefault.defaultProps = {
  isCheckout: false,
  onChecked: function () {},
};

AddressUserDefault.propTypes = {
  isCheckout: PropTypes.bool,
  onChecked: PropTypes.func,
};

export default AddressUserDefault;
