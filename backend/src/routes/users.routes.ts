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

export default router;
