import axios from "axios";

const axiosStudentIdentification = axios.create({
  baseURL: `${process.env.REACT_APP_API_END_POINT}/student-identification`,
  timeout: 10000,
});

// Unblock this interceptors to debugging req
axiosStudentIdentification.interceptors.request.use(
  (req) => {
    return req;
  },
  (error) => {
    // console.log(error);
    return Promise.reject(error);
  }
);

axiosStudentIdentification.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (error) => {
    // console.log(error);
    return Promise.reject(error);
  }
);

export default axiosStudentIdentification;
