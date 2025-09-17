// After login
import { setTokens, clearTokens, getRefreshToken } from "../authTokens";
import api from "../axiosInstance";

export const login = async (email: string, password: string): Promise<void> => {
  const res = await api.post<{ accessToken: string; refreshToken: string }>(
    "/login",
    {
      email,
      password,
    }
  );
  setTokens(res.data);
};

export const logout = async (): Promise<void> => {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    await api.post("/logout", { refreshToken });
  }
  clearTokens();
};
