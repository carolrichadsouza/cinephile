import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiFetch, ApiError } from "./api";

export type AuthUser = {
  userId: number;
  username: string;
  email: string;
  displayName: string | null;
  points: number;
  levelId: number;
};

type AuthResponse = AuthUser & { token: string };

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "cinephile_token";
const USER_KEY = "cinephile_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export { ApiError };
