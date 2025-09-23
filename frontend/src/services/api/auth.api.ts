import api from "../axiosInstance";
import { clearTokens, getRefreshToken } from "../authTokens";
import {
  loginSchema,
  signupSchema,
  tokensSchema,
  type LoginPayload,
  type SignupPayload,
  type Tokens,
} from "@/types/auth";

export const login = async (email: string, password: string): Promise<Tokens> => {
  const body: LoginPayload = loginSchema.parse({ email, password });
  const res = await api.post("/auth/login", body);
  const parsed = tokensSchema.safeParse(res.data);
  if (!parsed.success) throw new Error("Invalid login response");
  return parsed.data;
};

export const signup = async (payload: SignupPayload): Promise<Tokens> => {
  signupSchema.parse(payload);
  const res = await api.post("/auth/register", payload);
  const parsed = tokensSchema.safeParse(res.data);
  if (!parsed.success) throw new Error("Invalid signup response");
  return parsed.data;
};

export const logout = async () => {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    await api.post("/auth/logout", { refreshToken });
  }
  clearTokens();
};
