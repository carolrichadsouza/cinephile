import { createContext } from "react";

export type AuthUser = {
  userId: number;
  username: string;
  email: string;
  displayName: string | null;
  points: number;
  levelId: number;
};

export type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);