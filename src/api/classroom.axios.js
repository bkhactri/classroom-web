import axios from "axios";

const axiosClassroom = axios.create({
  baseURL: `${process.env.REACT_APP_API_END_POINT}/classroom`,
  timeout: 10000,
  headers: { "X-Custom-Header": "foobar" },
});

// Unblock this interceptors to debugging req
axiosClassroom.interceptors.request.use(
  (req) => {
    return req;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

axiosClassroom.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

export default axiosClassroom;
