import axios from "axios";

const axiosMail = axios.create({
  baseURL: `${process.env.REACT_APP_API_END_POINT}/mail`,
  timeout: 10000,
});

// Unblock this interceptors to debugging req
axiosMail.interceptors.request.use(
  (req) => {
    return req;
  },
  (error) => {
    // console.log(error);
    return Promise.reject(error);
  }
);

axiosMail.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (error) => {
    // console.log(error);
    return Promise.reject(error);
  }
);

export default axiosMail;
