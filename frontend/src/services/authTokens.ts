// authTokens.ts
export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

let accessToken: string | null = null;
let refreshToken: string | null = null;

const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';

// 🟢 load from localStorage on app start
export const initTokens = (): void => {
  const storedAccess = localStorage.getItem(ACCESS_KEY);
  const storedRefresh = localStorage.getItem(REFRESH_KEY);
  accessToken = storedAccess ?? null;
  refreshToken = storedRefresh ?? null;
};

// 🟢 set tokens in memory + localStorage
export const setTokens = (tokens: Tokens): void => {
  accessToken = tokens.accessToken;
  refreshToken = tokens.refreshToken;
  localStorage.setItem(ACCESS_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
};

// 🟢 get tokens from memory
export const getAccessToken = (): string | null => accessToken;
export const getRefreshToken = (): string | null => refreshToken;

// 🟢 clear tokens everywhere
export const clearTokens = (): void => {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};
