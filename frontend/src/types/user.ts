import { z } from "zod";

export const userSchema = z.object({
  _id: z.string(),
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type User = z.infer<typeof userSchema>;
