import { useState, useEffect, useCallback } from "react";
import { useColorScheme as useRNColorScheme, Platform } from "react-native";
import { getTheme, setTheme as storeTheme } from "@/services/storage";

function applyWebClass(isDark: boolean) {
  if (Platform.OS !== "web" || typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", isDark);
}

export function useTheme() {
  const systemScheme = useRNColorScheme();
  const [theme, setThemeState] = useState<"light" | "dark">(
    systemScheme === "light" || systemScheme === "dark" ? systemScheme : "light"
  );

  useEffect(() => {
    (async () => {
      try {
        const saved = await getTheme();
        if (saved) setThemeState(saved);
      } catch {
        // use default
      }
    })();
  }, []);

  useEffect(() => {
    applyWebClass(theme === "dark");
  }, [theme]);

  const toggle = useCallback(async () => {
    const next = theme === "light" ? "dark" : "light";
    setThemeState(next);
    try {
      await storeTheme(next);
    } catch {
      // ignore
    }
  }, [theme]);

  const setTheme = useCallback(async (t: "light" | "dark") => {
    setThemeState(t);
    try {
      await storeTheme(t);
    } catch {
      // ignore
    }
  }, []);

  return { theme, isDark: theme === "dark", toggle, setTheme };
}

export function useColorScheme() {
  return useTheme();
}
