import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://206.189.91.54/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authHeaders = JSON.parse(localStorage.getItem("authHeaders"));
    if (authHeaders) {
      config.headers["access-token"] = authHeaders["access-token"];
      config.headers["client"] = authHeaders["client"];
      config.headers["expiry"] = authHeaders["expiry"];
      config.headers["uid"] = authHeaders["uid"];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const createChannel = async (channelData) => {
  return axiosInstance.post("/channels", channelData);
};

export const getUserChannels = async () => {
  const headers = JSON.parse(localStorage.getItem("authHeaders"));
  return axiosInstance.get("/channels", { headers });
};

export const addMemberToChannel = async (channelId, memberId) => {
  const headers = JSON.parse(localStorage.getItem("authHeaders"));
  const data = { id: channelId, member_id: memberId };
  return axiosInstance.post("/channel/add_member", data, { headers });
};
export default axiosInstance;
