import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import { RefreshToken } from "../models/refreshToken.model";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  RegisterInput,
  LoginInput,
  RefreshInput,
} from "../schemas/auth.schemas";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { Account } from "@/models/account.model";

const router = Router();

const generateTokens = (userId: string, sessionExp: number) => {
  const accessToken = signAccessToken(userId);
  const refreshToken = signRefreshToken(userId, sessionExp);
  return { accessToken, refreshToken };
};

/** 🌱 Register */
router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.issues });
    return;
  }
  const { email, password, firstName, lastName }: RegisterInput = parsed.data;

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400).json({ error: "Email already used" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: passwordHash,
    firstName,
    lastName,
  });

  /// ----- Create new account ------
  await Account.create({
    userId: user._id,
    balance: 1 + Math.random() * 10000,
  });

  /// ----- Login ------
  const sessionExp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const { accessToken, refreshToken } = generateTokens(
    user._id.toString(),
    sessionExp
  );

  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    sessionExp,
  });

  res.json({
    message: "User created successfully.",
    accessToken,
    refreshToken,
  });

  res.status(201).json({ userId: user._id });
});

/** 🔑 Login */
router.post("/login", async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ errors: parsed.error.issues });
      return;
    }
    const { email, password }: LoginInput = parsed.data;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    // clear old refresh token session
    await RefreshToken.deleteMany({ userId: user._id }); 

    // generate new tokens
    const sessionExp = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const { accessToken, refreshToken } = generateTokens(
      user._id.toString(),
      sessionExp
    );

    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      sessionExp,
    });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.json({ error: "Login failed", details: error });
  }
});

/** ♻️ Refresh */
router.post("/refresh", async (req, res) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.issues });
    return;
  }
  const { refreshToken }: RefreshInput = parsed.data;

  try {
    const payload = verifyRefreshToken(refreshToken);
    const stored = await RefreshToken.findOne({ userId: payload.userId });
    if (!stored || stored.token !== refreshToken) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
    if (Date.now() > stored.sessionExp) {
      await stored.deleteOne();
      res.status(401).json({ error: "Session expired : Refresh Token" });
      return;
    }

    const newAccess = signAccessToken(payload.userId);
    const newRefresh = signRefreshToken(payload.userId, stored.sessionExp);
    stored.token = newRefresh;
    await stored.save();

    res.json({ accessToken: newAccess, refreshToken: newRefresh });
  } catch {
    res.status(401).json({ error: "Refresh failed" });
  }
});

/** 🚪 Logout */
router.post("/logout", async (req, res) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.issues });
    return;
  }
  const { refreshToken }: RefreshInput = parsed.data;
  try {
    const payload = verifyRefreshToken(refreshToken);
    await RefreshToken.deleteMany({ userId: payload.userId });
  } catch {}
  res.json({ message: "Logged out" });
});

export default router;
