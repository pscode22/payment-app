import { Router } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { User } from "../models/user.model";

const router = Router();

/** 👤 Profile */
router.get("/profile", authMiddleware, async (req: AuthRequest, res) => {
  if (!req.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const user = await User.findById(req.userId).select("email");
  res.json({ user });
});

export default router;
