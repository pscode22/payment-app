import { createContext, useContext, useMemo, useState } from "react";
import { initTokens, clearTokens, getAccessToken } from "@/services/authTokens";
import { logout as logoutApi } from "@/services/api/auth.api";

const decodeJWT = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
};

const isTokenValid = (token: string) => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp > now;
};

type AuthContextType = {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize tokens and check auth state synchronously
    initTokens();
    const token = getAccessToken();
    return token ? isTokenValid(token) : false;
  });

  const login = (token: string) => {
    if (isTokenValid(token)) {
      setIsAuthenticated(true);
    } else {
      console.warn("Invalid or expired token");
      clearTokens();
      setIsAuthenticated(false);
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      console.log("Logout API failed, clearing tokens anyway");
    }
    clearTokens();
    setIsAuthenticated(false);
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);