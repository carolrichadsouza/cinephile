import { useState, type ReactNode } from "react";
import { apiFetch } from "./api";
import { AuthContext, type AuthUser } from "./auth-context-def";

type AuthResponse = AuthUser & { token: string };

const TOKEN_KEY = "cinephile_token";
const USER_KEY = "cinephile_user";

function getStoredUser(): AuthUser | null {
  const storedUser = localStorage.getItem(USER_KEY);
  const storedToken = localStorage.getItem(TOKEN_KEY);
  if (!storedUser || !storedToken) return null;
  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const isLoading = false;

  function persistSession(response: AuthResponse) {
    const { token, ...authUser } = response;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    setUser(authUser);
  }

  async function login(email: string, password: string) {
    const response = await apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    persistSession(response);
  }

  async function register(username: string, email: string, password: string) {
    const response = await apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: { username, email, password },
    });
    persistSession(response);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}