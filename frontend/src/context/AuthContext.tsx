import { createContext, useContext, useEffect, useState } from "react";
import { userSchema, type User } from "@/types/user";
import { initTokens, clearTokens, getAccessToken } from "@/services/authTokens";
import { logout as logoutApi } from "@/services/api/auth.api";
import { getProfile } from "@/services/api/user.api";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const res = await getProfile();
      const parsed = userSchema.safeParse(res);
      if (parsed.success) setUser(parsed.data);
      else setUser(null);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    initTokens();
    if (getAccessToken()) fetchUser();
  }, []);

  const login = () => fetchUser();

  const logout = async () => {
    await logoutApi();
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
