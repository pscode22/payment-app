import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  // username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.email('Invalid email format'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});
export type RefreshInput = z.infer<typeof refreshSchema>;
