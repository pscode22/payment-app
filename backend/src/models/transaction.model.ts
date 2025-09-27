// models/transaction.model.ts
import mongoose from "mongoose";
import { z } from "zod";

// Zod schema
export const TransactionSchema = z.object({
  fromUserId: z.string().refine(val => mongoose.Types.ObjectId.isValid(val)),
  toUserId: z.string().refine(val => mongoose.Types.ObjectId.isValid(val)),
  amount: z.number().positive(),
  status: z.enum(['completed', 'pending', 'failed']).default('pending'),
  description: z.string().optional(),
});

// Mongoose interface
interface ITransaction extends mongoose.Document {
  fromUserId: mongoose.Types.ObjectId;
  toUserId: mongoose.Types.ObjectId;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema
const transactionSchema = new mongoose.Schema<ITransaction>({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'failed'],
    default: 'pending'
  },
  description: String
}, { timestamps: true });

// Indexes for performance
transactionSchema.index({ fromUserId: 1, createdAt: -1 });
transactionSchema.index({ toUserId: 1, createdAt: -1 });

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);