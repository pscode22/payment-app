import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { Account } from "@/models/user.model";
import mongoose from "mongoose";

const router = Router();

router.get("/balance", authMiddleware, async (req, res) => {
  const account = await Account.findOne({
    userId: (req as unknown as { userId: mongoose.ObjectId }).userId,
  });

  if (!account) {
    res.status(401).json({
      success: false,
      message: "user account not found.",
    });
    return;
  }

  res.json({
    balance: account.balance,
  });
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // userId of the sender
    const fromUserId = (req as any).userId;
    const { amount, toUser } = req.body;
    // Fetch sender's account
    const account = await Account.findOne({ userId: fromUserId }).session(
      session
    );

    if (!account || account.balance < amount) {
      await session.abortTransaction();
      res.status(400).json({
        message: "Insufficient balance",
      });
      return;
    }

    const toAccount = await Account.findOne({ userId: toUser }).session(
      session
    );

    if (!toAccount) {
      await session.abortTransaction();
      res.status(400).json({
        message: "Invalid receiver account",
      });
      return;
    }

    // Perform the transfer
    await Account.updateOne(
      { userId: (req as any).userId },
      { $inc: { balance: -amount } }
    ).session(session);
    await Account.updateOne(
      { userId: toUser },
      { $inc: { balance: amount } }
    ).session(session);

    // Commit the transaction
    await session.commitTransaction();

    res.json({
      message: "Transfer successful",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: "Transfer failed." });
    return;
  }
});

export default router;
