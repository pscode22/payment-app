import jwt, { JwtPayload } from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export interface AccessPayload extends JwtPayload { userId: string; }
export interface RefreshPayload extends JwtPayload { userId: string; sessionExp: number; }

export const signAccessToken = (userId: string): string =>
  jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: '15m' });

export const signRefreshToken = (userId: string, sessionExp: number): string =>
  jwt.sign({ userId, sessionExp }, REFRESH_SECRET, { expiresIn: '7d' });

export const verifyAccessToken = (token: string): AccessPayload =>
  jwt.verify(token, ACCESS_SECRET) as AccessPayload;

export const verifyRefreshToken = (token: string): RefreshPayload =>
  jwt.verify(token, REFRESH_SECRET) as RefreshPayload;
