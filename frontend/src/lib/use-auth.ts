import { useContext } from "react";
import { AuthContext } from "./auth-context-def";
import { ApiError } from "./api";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export { ApiError };