import axios from 'axios';
import queryString from 'query-string';

/* const baseURL =  process.env.REACT_APP_API_URL;*/
/* const baseURL =  "http://localhost:3300/apis";  */
  const baseURL = "https://f5server.vercel.app/apis"; 

//Set up default config for http request
const axiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-type': 'application/json',
  },
  withCredentials: true,
  //query string dung de parse url thanh json thay cho axios (tranh tuong hop null url)
  paramsSerializer: (params) => queryString.stringify(params),
});

//handle request
axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    throw error;
  },
);

//handle response
axiosClient.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    throw error;
  },
);

export default axiosClient;
