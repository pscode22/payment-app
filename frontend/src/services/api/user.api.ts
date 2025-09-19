import type { User } from "@/types/user";
import api from "../axiosInstance";

// protected request:
export const getProfile = async () : Promise<User> => {
  const res = await api.get("/profile");
  return res.data;
};
