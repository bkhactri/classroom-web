import axios from "axios";

const axiosUser = axios.create({
  baseURL: `${process.env.REACT_APP_API_END_POINT}/account`,
  timeout: 10000,
});

// Unblock this interceptors to debugging req
axiosUser.interceptors.request.use(
  (req) => {
    return req;
  },
  (error) => {
    // console.log(error);
    return Promise.reject(error);
  }
);

axiosUser.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (error) => {
    // console.log(error);
    return Promise.reject(error);
  }
);

export default axiosUser;
