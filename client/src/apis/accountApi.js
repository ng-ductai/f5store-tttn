import axiosClient from "./axiosClient";
const ACCOUNT_API_ENDPOINT = "/accounts";

const accountApi = {
  // gửi mã xác nhận
  postSendVerifyCode: (email) => {
    const url = ACCOUNT_API_ENDPOINT + "/verify";
    return axiosClient.post(url, email);
  },

  // đăng ký
  postSignUp: (account) => {
    const url = ACCOUNT_API_ENDPOINT + "/signup";
    return axiosClient.post(url, account);
  },

  // gửi mã xác nhận lấy lại mật khẩu
  postSendCodeForgotPW: (email) => {
    const url = ACCOUNT_API_ENDPOINT + "/verify/forgot";
    return axiosClient.post(url, email);
  },

  // reset password
  postResetPassword: (account) => {
    const url = ACCOUNT_API_ENDPOINT + "/reset-pw";
    return axiosClient.post(url, account);
  },

  // update password
  putUpdatePassword: (accountId = "", value = {}) => {
    const url = ACCOUNT_API_ENDPOINT + "/update-pw";
    return axiosClient.put(url, { accountId, value });
  },
};

export default accountApi;
