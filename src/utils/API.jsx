import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://206.189.91.54/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
