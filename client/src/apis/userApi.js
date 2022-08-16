import {ACCESS_TOKEN_KEY} from "../constants/index";
import axiosClient from "./axiosClient";
const USER_API_URL = "/user";

const userApi = {
  getUser: () => {
    const url = USER_API_URL;
    if (process.env.NODE_ENV === "production")
      return axiosClient.get(url, {
        params: {
          token: localStorage.getItem(ACCESS_TOKEN_KEY),
        },
      });
    else return axiosClient.get(url);
  },
  
  putUpdateUser: (userId = "", value = {}) => {
    const url = USER_API_URL + "/update";
    return axiosClient.put(url, { userId, value });
  },

};

export default userApi;
