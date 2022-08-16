import axiosClient from "./axiosClient";
const SLIDER_API_ENDPOINT = "/slider";

const sliderApi = {
  // Lấy danh sách slider
  getSliderList: () => {
    const url = SLIDER_API_ENDPOINT;
    return axiosClient.get(url);
  },
};

export default sliderApi;
