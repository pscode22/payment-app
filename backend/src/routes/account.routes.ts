import { Router } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import mongoose from "mongoose";
import { z } from "zod";
import { Account } from "@/models/account.model";
import { Transaction } from "@/models/transaction.model";
import bcrypt from "bcryptjs";
import { User } from "@/models/user.model";

const router = Router();

// Validation schemas
const transferSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  toUser: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), "Invalid user ID"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const transactionQuerySchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(50).default(10),
  type: z.enum(["all", "sent", "received"]).default("all"),
});

// Get user account balance
router.get("/balance", authMiddleware, async (req: AuthRequest, res) => {
  const account = await Account.findOne({ userId: req.userId });

  if (!account) {
    res.status(404).json({ success: false, message: "Account not found" });
    return;
  }

  res.json({ balance: account.balance });
});

// Get user transaction history with pagination
router.post("/transactions", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { page, limit, type } = transactionQuerySchema.parse(req.body);

    // Build query based on transaction type
    let matchQuery;
    if (type === "sent") {
      matchQuery = { fromUserId: req.userId };
    } else if (type === "received") {
      matchQuery = { toUserId: req.userId };
    } else {
      matchQuery = {
        $or: [{ fromUserId: req.userId }, { toUserId: req.userId }],
      };
    }

    const [transactions, total] = await Promise.all([
      Transaction.find(matchQuery)
        .populate("fromUserId", "firstName lastName")
        .populate("toUserId", "firstName lastName")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Transaction.countDocuments(matchQuery),
    ]);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalTransactions: total,
        },
      },
    });
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: error.issues,
      });
      return;
    }
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch transactions" });
    return;
  }
});

// Transfer money between accounts
router.post("/transfer", authMiddleware, async (req: AuthRequest, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, toUser, password } = transferSchema.parse(req.body);

    const user = await User.findOne({ _id: req.userId }).session(session);
    if (!user) {
      await session.abortTransaction();
      res.status(400).json({ error: "Sender not found" });
      return;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      await session.abortTransaction();
      res.status(400).json({ error: "Incorrect password" });
      return;
    }

    // Get both accounts within transaction
    const [senderAccount, receiverAccount] = await Promise.all([
      Account.findOne({ userId: req.userId }).session(session),
      Account.findOne({ userId: toUser }).session(session),
    ]);

    if (!senderAccount) {
      await session.abortTransaction();
      res.status(400).json({ error: "Sender not found" });
      return;
    }

    if (!senderAccount || senderAccount.balance < amount) {
      await session.abortTransaction();
      res.status(400).json({ success: false, message: "Insufficient balance" });
      return;
    }

    if (!receiverAccount) {
      await session.abortTransaction();
      res.status(400).json({ success: false, message: "Invalid receiver" });
      return;
    }

    // Create transaction record
    const transaction = new Transaction({
      fromUserId: req.userId,
      toUserId: toUser,
      amount,
      status: "pending",
    });

    // Execute transfer atomically
    await Promise.all([
      Account.updateOne(
        { userId: req.userId },
        { $inc: { balance: -amount } }
      ).session(session),
      Account.updateOne(
        { userId: toUser },
        { $inc: { balance: amount } }
      ).session(session),
      transaction.save({ session }),
    ]);

    // Mark transaction as completed
    transaction.status = "completed";
    await transaction.save({ session });
    await session.commitTransaction();

    res.json({
      success: true,
      message: "Transfer successful",
      data: { transactionId: transaction._id, amount },
    });
    return;
  } catch (error) {
    await session.abortTransaction();
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: error.issues,
      });
      return;
    }
    res.status(500).json({ success: false, message: "Transfer failed" });
    return;
  } finally {
    session.endSession();
  }
});

export default router;
