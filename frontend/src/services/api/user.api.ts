import api from "../axiosInstance";

// protected request:
export const getProfile = async () => {
  const res = await api.get("/profile");
  return res.data;
};
