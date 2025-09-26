import type { GetUser, User } from "@/types/user";
import api from "../axiosInstance";

export const getProfile = async (): Promise<{ user: User }> => {
  const res = await api.get("/user/profile");
  return res.data;
};

export const getUserBalance = async (): Promise<{ balance: number }> => {
  const res = await api.get("/account/balance");
  return res.data;
};

export const getAllOtherUsers = async ({
  name,
}: {
  name: string;
}): Promise<{ users: GetUser[] }> => {
  const res = await api.post("/user/all", { name });
  return res.data;
};

/** ❌ Delete user account */
export const deleteAccount = async (): Promise<{ message: string }> => {
  const res = await api.delete("/account");
  return res.data;
};
