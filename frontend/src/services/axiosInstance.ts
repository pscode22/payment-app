// axiosInstance.ts
import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "./authTokens";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: "/auth", // your API base
  headers: { "Content-Type": "application/json" },
});

// Promise to queue refresh calls
let refreshPromise: Promise<void> | null = null;

// 🔑 REQUEST INTERCEPTOR — attach access token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔄 REFRESH
const doRefresh = async (): Promise<void> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token available");

  const response = await axios.post<{
    accessToken: string;
    refreshToken: string;
  }>("/auth/refresh", { refreshToken });

  setTokens({
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken,
  });
};

const ensureRefreshed = async (): Promise<void> => {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

// 🔄 RESPONSE INTERCEPTOR — handle 401 + retry
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      getRefreshToken() &&
      originalRequest &&
      !(originalRequest as unknown as Record<string, unknown>)._retry
    ) {
      (originalRequest as unknown as Record<string, unknown>)._retry = true;

      try {
        await ensureRefreshed();
        const token = getAccessToken();
        if (token && originalRequest.headers) {
          (
            originalRequest.headers as Record<string, string>
          ).Authorization = `Bearer ${token}`;
        }
        return api(originalRequest);
      } catch (err) {
        clearTokens();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
