import { z } from "zod";

// 📝 Common schemas
export const tokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type Tokens = z.infer<typeof tokensSchema>;

// 📝 Auth requests
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(4),
});
export type LoginPayload = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  email: z.email(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  password: z.string().min(4),
});
export type SignupPayload = z.infer<typeof signupSchema>;
