// types/transaction.ts
import { z } from "zod";

// Transaction schemas matching backend
export const TransactionSchema = z.object({
  _id: z.string(),
  fromUserId: z.object({
    _id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
  toUserId: z.object({
    _id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
  amount: z.number(),
  status: z.enum(["completed", "pending", "failed"]),
  createdAt: z.string(),
  updatedAt: z.string(),
  description: z.string().optional(),
});

export const TransactionQuerySchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(50).default(10),
  type: z.enum(["all", "sent", "received"]).default("all"),
});

export const TransferSchema = z.object({
  amount: z.number().positive(),
  toUser: z.string(),
  password: z.string().min(6),
});

// TypeScript types
export type Transaction = z.infer<typeof TransactionSchema>;
export type TransactionQuery = z.infer<typeof TransactionQuerySchema>;
export type TransferRequest = z.infer<typeof TransferSchema>;

export interface TransactionResponse {
  success: boolean;
  data: {
    transactions: Transaction[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalTransactions: number;
    };
  };
}

export interface TransferResponse {
  success: boolean;
  message: string;
  data: {
    transactionId: string;
    amount: number;
  };
}
