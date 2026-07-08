import { useState, useEffect, useCallback } from "react";
import { User } from "@/types";
import { checkAuth, loginUser, registerUser, logoutUser } from "@/services/auth";

export function useAuth() {
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
      // noop
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

  return { user, isLoading, isAuthenticated, login, register, logout };
}
