import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { User } from "@/types/user";
import { getProfile } from "@/services/api/user.api";
import { getAccessToken } from "@/services/authTokens";

const STORE_USER_KEY = "user";

export type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);

  // single setter that keeps localStorage in sync
  const setUser = useCallback((u: User | null) => {
    setUserState(u);
    try {
      if (typeof window !== "undefined") {
        // store null as JSON "null" (consistent)
        localStorage.setItem(STORE_USER_KEY, JSON.stringify(u));
      }
    } catch (err) {
      console.error("Failed to write user to localStorage", err);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // 1) Try to load from localStorage
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(STORE_USER_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as User | null;
          if (mounted) setUserState(parsed);
          return; // ✅ stop here if we got a user from storage
        }
      } catch (err) {
        console.error("Failed to parse stored user from localStorage", err);
        try {
          localStorage.removeItem(STORE_USER_KEY);
        } catch {
          /* ignore */
        }
      }
    }

    // 2) If not in storage, fetch from API
    const token = getAccessToken();
    if (!token) return;

    (async () => {
      try {
        const profile = await getProfile(); // getProfile() returns User
        if (!mounted) return;
        setUserState(profile.user);
        try {
          if (typeof window !== "undefined") {
            localStorage.setItem(STORE_USER_KEY, JSON.stringify(profile));
          }
        } catch (err) {
          console.error("Failed to persist user to localStorage", err);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
        if (mounted) {
          setUserState(null);
          try {
            if (typeof window !== "undefined") {
              localStorage.removeItem(STORE_USER_KEY);
            }
          } catch {
            /* ignore */
          }
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
