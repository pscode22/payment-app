import { z } from "zod";

export const userSchema = z.object({
  _id: z.string(),
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const getUserSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

export type User = z.infer<typeof userSchema>;
export type GetUser = z.infer<typeof getUserSchema>;
