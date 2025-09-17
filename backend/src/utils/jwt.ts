import jwt, { JwtPayload } from "jsonwebtoken";

export interface AccessPayload extends JwtPayload {
  userId: string;
}
export interface RefreshPayload extends JwtPayload {
  userId: string;
  sessionExp: number;
}

export const signAccessToken = (userId: string): string =>
  jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET!, { expiresIn: "15m" });

export const signRefreshToken = (userId: string, sessionExp: number): string =>
  jwt.sign({ userId, sessionExp }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });

export const verifyAccessToken = (token: string): AccessPayload =>
  jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as AccessPayload;

export const verifyRefreshToken = (token: string): RefreshPayload =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as RefreshPayload;
