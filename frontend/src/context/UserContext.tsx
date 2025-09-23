import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/types/user";
import { getProfile } from "@/services/api/user.api";

const storeUser = "user";

type UserContextType = {
  user: User | null;
  setUser: (user: User) => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem(storeUser);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      const getUserFromApi = async () => {
        try {
          const res = await getProfile();
          setUser(res);
          localStorage.setItem(storeUser, JSON.stringify(res));
        } catch (error) {
          setUser(null);
          localStorage.setItem(storeUser, JSON.stringify(null));
        }
      };

      getUserFromApi();
    }
  }, []);


  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
