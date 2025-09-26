import { Router } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { User } from "../models/user.model";
import { Account } from "@/models/account.model";
import { RefreshToken } from "@/models/refreshToken.model";

const router = Router();

/** 👤 Profile */
router.get("/profile", authMiddleware, async (req: AuthRequest, res) => {
  if (!req.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const user = await User.findById(req.userId).select("email firstName lastName");
  res.json({ user });
});

/** Get All Other Users */
router.post("/all", authMiddleware, async (req: AuthRequest, res) => {
  if (!req.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { name } = req.body;

  const users = await User.find({
    _id: { $ne: req.userId },
    $or: [
      { firstName: { $regex: name, $options: "i" } },
      { lastName: { $regex: name, $options: "i" } },
    ],
  }).select("_id firstName lastName");

  res.json({ users });
});

/** ❌ Delete Account */
router.delete("/account", async (req: AuthRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.userId;

    // Delete linked collections
    await Promise.all([
      User.findByIdAndDelete(userId),
      Account.deleteOne({ userId }),
      RefreshToken.deleteMany({ userId }),
    ]);

    return res.json({ message: "Account deleted successfully." });
  } catch (err) {
    console.error("Delete account error:", err);
    return res.status(500).json({ error: "Failed to delete account." });
  }
});

export default router;
