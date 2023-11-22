import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://206.189.91.54/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const createChannel = async (channelData) => {
  const headers = JSON.parse(localStorage.getItem("authHeaders"));
  return axiosInstance.post("/api/v1/channels", channelData, { headers });
};

export const getUserChannels = async () => {
  const headers = JSON.parse(localStorage.getItem("authHeaders"));
  return axiosInstance.get("/api/v1/channels", { headers });
};

export const addMemberToChannel = async (channelId, memberId) => {
  const headers = JSON.parse(localStorage.getItem("authHeaders"));
  const data = { id: channelId, member_id: memberId };
  return axiosInstance.post("/api/v1/channel/add_member", data, { headers });
};
export default axiosInstance;
