import { User } from "@/types";
import { getUser, setUser, removeUser } from "./storage";

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<User> {
  const existing = await getUser();
  if (existing && existing.email === email) {
    throw new Error("User already exists with this email");
  }
  const user: User = { name, email, password };
  await setUser(user);
  return user;
}

export async function loginUser(
  email: string,
  password: string
): Promise<Omit<User, "password">> {
  const user = await getUser();
  if (!user) throw new Error("No account found. Please register first.");
  if (user.email !== email || user.password !== password) {
    throw new Error("Invalid email or password");
  }
  return { name: user.name, email: user.email };
}

export async function logoutUser(): Promise<void> {
  await removeUser();
}

export async function checkAuth(): Promise<Omit<User, "password"> | null> {
  const user = await getUser();
  return user ? { name: user.name, email: user.email } : null;
}
