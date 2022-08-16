import axiosClient from "./axiosClient";
import { ACCESS_TOKEN_KEY } from "../constants/index";

const ADMIN_API_ENDPOINT = "/admin";

const adminApi = {
  // thêm sản phẩm
  postAddProduct: (product) => {
    const url = ADMIN_API_ENDPOINT + "/product/add";
    return axiosClient.post(url, product);
  },

  // lấy danh sách sản phẩm theo loại và trang
  getProductListByType: (type = 0, page = 1, perPage = 1) => {
    const url = ADMIN_API_ENDPOINT + "/products";
    return axiosClient.get(url, {
      params: { type, page, perPage },
    });
  },

  // Xoá 1 sản phẩm (admin page)
  removeProduct: (id) => {
    const url = ADMIN_API_ENDPOINT + "/products/remove";
    return axiosClient.delete(url, { params: { id } });
  },

  // api: Lấy 1 sản phẩm
  getProduct: (id) => {
    const url = ADMIN_API_ENDPOINT;
    return axiosClient.get(url, { params: { id } });
  },

  // Cập nhật 1 sản phẩm
  updateProduct: (products) => {
    const url = ADMIN_API_ENDPOINT + "/product/update";
    return axiosClient.put(url, products);
  },

  // đăng ký
  postAddAdmin: (account) => {
    const url = ADMIN_API_ENDPOINT + "/admin/add";
    return axiosClient.post(url, account);
  },

  // đăng nhập với quyền admin
  postLogin: (account) => {
    const url = ADMIN_API_ENDPOINT + "/login";
    return axiosClient.post(url, account);
  },

  // api: authentication
  getAuth: () => {
    const url = ADMIN_API_ENDPOINT + "/auth";
    if (process.env.NODE_ENV === "production")
      return axiosClient.get(url, {
        params: {
          token: localStorage.getItem(ACCESS_TOKEN_KEY),
        },
      });
    else return axiosClient.get(url);
  },

  // api: refresh token
  postRefreshToken: (refreshToken) => {
    const url = ADMIN_API_ENDPOINT + "/refresh_token";
    return axiosClient.post(url, refreshToken);
  },

  // get admin user
  getUser: () => {
    const url = ADMIN_API_ENDPOINT + "/user";
    if (process.env.NODE_ENV === "production")
      return axiosClient.get(url, {
        params: {
          token: localStorage.getItem(ACCESS_TOKEN_KEY),
        },
      });
    else return axiosClient.get(url);
  },

  // api: logout
  postLogout: () => {
    const url = ADMIN_API_ENDPOINT + "/logout";
    if (process.env.NODE_ENV === "production")
      return axiosClient.post(url, {
        token: localStorage.getItem(ACCESS_TOKEN_KEY),
      });
    else return axiosClient.post(url);
  },

  // lấy danh sách admin user
  getUserAdminList: () => {
    const url = ADMIN_API_ENDPOINT + "/users";
    return axiosClient.get(url);
  },

  // lấy danh sách khách hàng
  getCustomerList: (page = 1) => {
    const url = ADMIN_API_ENDPOINT + "/customer";
    return axiosClient.get(url, { params: page });
  },

  // cập nhật 1 tài khoản admin
  updateAccountAdmin: (account) => {
    const url = ADMIN_API_ENDPOINT + "/customer/updateAd";
    return axiosClient.put(url, account);
  },

  // cập nhật 1 tài khoản khách hàng
  updateAccountCustomer: (account) => {
    const url = ADMIN_API_ENDPOINT + "/customer/updateCus";
    return axiosClient.put(url, account);
  },

  // xoá 1 khách hàng
  delCustomer: (userId) => {
    const url = ADMIN_API_ENDPOINT + "/customer/del";
    return axiosClient.delete(url, { params: { userId } });
  },

  // Lấy danh sách đơn hàng
  getOrderList: () => {
    const url = ADMIN_API_ENDPOINT + "/order";
    return axiosClient.get(url);
  },

  // cập nhật trạng thái đơn hàng
  postUpdateOrderStatus: (id, orderStatus) => {
    const url = ADMIN_API_ENDPOINT + "/order";
    return axiosClient.post(url, { id, orderStatus });
  },

  // Lấy danh sách slider
  getSliderList: () => {
    const url = ADMIN_API_ENDPOINT + "/slider";
    return axiosClient.get(url);
  },

  postAddSlider: (slider) => {
    const url = ADMIN_API_ENDPOINT + "/slider/add";
    return axiosClient.post(url, slider);
  },

  updateSlider: (slide) => {
    const url = ADMIN_API_ENDPOINT + "/slider/update";
    return axiosClient.put(url, slide);
  },

  // xoá 1 slide
  delSlider: (slideId) => {
    const url = ADMIN_API_ENDPOINT + "/slider/del";
    return axiosClient.delete(url, { params: { slideId } });
  },
};

export default adminApi;
