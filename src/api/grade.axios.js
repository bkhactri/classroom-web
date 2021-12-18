import axios from "axios";

const axiosGrade = axios.create({
  baseURL: `${process.env.REACT_APP_API_END_POINT}/grade`,
  timeout: 10000,
});

// Unblock this interceptors to debugging req
axiosGrade.interceptors.request.use(
  (req) => {
    return req;
  },
  (error) => {
    // console.log(error);
    return Promise.reject(error);
  }
);

axiosGrade.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (error) => {
    // console.log(error);
    return Promise.reject(error);
  }
);

export default axiosGrade;
