import type { User } from "@/types/user";
import api from "../axiosInstance";

// protected request:
export const getProfile = async () : Promise<User> => {
  const res = await api.get("/user/profile");
  return res.data;
};


export const getUserBalance = async () : Promise<{ balance: number }> => {
  const res = await api.get("/account/balance");
  return res.data;
}