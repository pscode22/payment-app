
// Updated services/api/user.api.ts
import type { GetUser, User } from "@/types/user";
import type { TransactionQuery, TransactionResponse, TransferRequest, TransferResponse } from "@/types/transaction";
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

// Get user transaction history
export const getTransactions = async (query: TransactionQuery): Promise<TransactionResponse> => {
  const res = await api.post("/account/transactions", query);
  return res.data;
};

// Transfer money to another user
export const transferMoney = async (transfer: TransferRequest): Promise<TransferResponse> => {
  const res = await api.post("/account/transfer", transfer);
  return res.data;
};

/** ❌ Delete user account */
export const deleteAccount = async (): Promise<{ message: string }> => {
  const res = await api.delete("/account");
  return res.data;
};