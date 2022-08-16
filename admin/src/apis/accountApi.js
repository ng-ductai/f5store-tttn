import axiosClient from './axiosClient';

const ACCOUNT_API_ENDPOINT = '/accounts';

const accountApi = {
  // gửi mã xác nhận
  postSendVerifyCode: (email) => {
    const url = ACCOUNT_API_ENDPOINT + '/verify';
    return axiosClient.post(url, email);
  },

  // đăng ký
  postSignUp: (account) => {
    const url = ACCOUNT_API_ENDPOINT + '/signup';
    return axiosClient.post(url, account);
  },

  // gửi mã xác nhận lấy lại mật khẩu
  postSendCodeForgotPW: (email) => {
    const url = ACCOUNT_API_ENDPOINT + '/verify/forgot';
    return axiosClient.post(url, email);
  },

  // reset password
  postResetPassword: (account) => {
    const url = ACCOUNT_API_ENDPOINT + '/reset-pw';
    return axiosClient.post(url, account);
  },
};

export default accountApi;
