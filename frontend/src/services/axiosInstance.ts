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
  baseURL: import.meta.env.VITE_API_URL, // your API base
  headers: { "Content-Type": "application/json" },
});

// Promise to queue refresh calls
let refreshPromise: Promise<void> | null = null;

// 📝 Public endpoints (no Authorization header)
const publicPaths = ["/login", "/register", "/refresh"];

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Check whether the URL matches any public path
  const isPublic = publicPaths.some((path) => config.url?.startsWith(path));

  if (!isPublic) {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
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
  }>(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });

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

    // If no response or no originalRequest, just reject
    if (!error.response || !originalRequest) return Promise.reject(error);

    const status = error.response.status;
    const isRefreshRequest = originalRequest.url?.includes("/refresh");

    // Only refresh if:
    //  - status is 401
    //  - we have a refresh token
    //  - not already retried
    //  - not the refresh endpoint itself
    if (
      status === 401 &&
      !isRefreshRequest &&
      getRefreshToken() &&
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
      } catch (refreshError) {
        // Only clear tokens if refresh itself failed
        console.error("Token refresh failed:", refreshError);
        clearTokens();

        // Optionally redirect to login
        // window.location.href = '/signin';

        return Promise.reject(refreshError);
      }
    }

    // For other 401s or when refresh token is missing, clear tokens
    if (status === 401 && !getRefreshToken()) {
      clearTokens();
    }

    return Promise.reject(error);
  }
);

export default api;
