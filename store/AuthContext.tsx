import { createContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { User } from "@/types";
import { checkAuth, loginUser, registerUser, logoutUser } from "@/services/auth";

interface AuthContextType {
  user: Omit<User, "password"> | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      const userData = await checkAuth();
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    const userData = await loginUser(email, password);
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await registerUser(name, email, password);
      setUser({ name, email });
      setIsAuthenticated(true);
    },
    []
  );

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
