import axios from "axios";

const axiosGradeRequest = axios.create({
  baseURL: `${process.env.REACT_APP_API_END_POINT}/grade-request`,
  timeout: 10000,
});

// Unblock this interceptors to debugging req
axiosGradeRequest.interceptors.request.use(
  (req) => {
    return req;
  },
  (error) => {
    // console.log(error);
    return Promise.reject(error);
  }
);

axiosGradeRequest.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (error) => {
    // console.log(error);
    return Promise.reject(error);
  }
);

export default axiosGradeRequest;
