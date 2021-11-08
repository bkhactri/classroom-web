import axios from "axios";

const axiosAuth = axios.create({
  baseURL: `${process.env.REACT_APP_API_END_POINT}/auth`,
  timeout: 10000,
});

// Unblock this interceptors to debugging req
axiosAuth.interceptors.request.use(
  (req) => {
    return req;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

axiosAuth.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

export default axiosAuth;
