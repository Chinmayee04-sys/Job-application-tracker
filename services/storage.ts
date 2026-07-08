import { Platform } from "react-native";
import { JobApplication, User } from "@/types";

const STORAGE_KEYS = {
  APPLICATIONS: "@jobtrack_applications",
  USER: "@jobtrack_user",
  THEME: "@jobtrack_theme",
} as const;

function serialize(value: unknown): string {
  return JSON.stringify(value);
}

function deserialize<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

const isWeb = Platform.OS === "web";

function getWebStorage() {
  return typeof localStorage !== "undefined" ? localStorage : null;
}

async function getItemWeb(key: string): Promise<string | null> {
  const storage = getWebStorage();
  return storage ? storage.getItem(key) : null;
}

async function setItemWeb(key: string, value: string): Promise<void> {
  const storage = getWebStorage();
  if (storage) storage.setItem(key, value);
}

async function removeItemWeb(key: string): Promise<void> {
  const storage = getWebStorage();
  if (storage) storage.removeItem(key);
}

async function getItemNative<T>(key: string): Promise<T | null> {
  try {
    const { default: AsyncStorage } = await import(
      "@react-native-async-storage/async-storage"
    );
    const value = await AsyncStorage.getItem(key);
    return deserialize<T>(value);
  } catch {
    return null;
  }
}

async function setItemNative<T>(key: string, value: T): Promise<void> {
  try {
    const { default: AsyncStorage } = await import(
      "@react-native-async-storage/async-storage"
    );
    await AsyncStorage.setItem(key, serialize(value));
  } catch {
    // noop
  }
}

async function removeItemNative(key: string): Promise<void> {
  try {
    const { default: AsyncStorage } = await import(
      "@react-native-async-storage/async-storage"
    );
    await AsyncStorage.removeItem(key);
  } catch {
    // noop
  }
}

export async function getItem<T>(key: string): Promise<T | null> {
  if (isWeb) {
    const value = await getItemWeb(key);
    return deserialize<T>(value);
  }
  return getItemNative<T>(key);
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  if (isWeb) {
    return setItemWeb(key, serialize(value));
  }
  return setItemNative(key, value);
}

export async function removeItem(key: string): Promise<void> {
  if (isWeb) {
    return removeItemWeb(key);
  }
  return removeItemNative(key);
}

export async function clearAll(): Promise<void> {
  const keys = Object.values(STORAGE_KEYS);
  if (isWeb) {
    const storage = getWebStorage();
    if (storage) keys.forEach((k) => storage.removeItem(k));
  } else {
    try {
      const { default: AsyncStorage } = await import(
        "@react-native-async-storage/async-storage"
      );
      await AsyncStorage.multiRemove(keys);
    } catch {
      // noop
    }
  }
}

export async function getUser(): Promise<User | null> {
  return getItem<User>(STORAGE_KEYS.USER);
}

export async function setUser(user: User): Promise<void> {
  return setItem(STORAGE_KEYS.USER, user);
}

export async function removeUser(): Promise<void> {
  return removeItem(STORAGE_KEYS.USER);
}

export async function getApplications(): Promise<JobApplication[]> {
  const data = await getItem<JobApplication[]>(STORAGE_KEYS.APPLICATIONS);
  return data ?? [];
}

export async function setApplications(
  applications: JobApplication[]
): Promise<void> {
  return setItem(STORAGE_KEYS.APPLICATIONS, applications);
}

export async function getTheme(): Promise<"light" | "dark" | null> {
  return getItem<"light" | "dark">(STORAGE_KEYS.THEME);
}

export async function setTheme(theme: "light" | "dark"): Promise<void> {
  return setItem(STORAGE_KEYS.THEME, theme);
}

export { STORAGE_KEYS };
