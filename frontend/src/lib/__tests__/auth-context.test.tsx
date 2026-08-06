import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "../auth-context";
import { useAuth } from "../use-auth";
import { apiFetch } from "../api";
vi.mock("../api", () => ({
  apiFetch: vi.fn(),
  ApiError: class ApiError extends Error {},
}));
function Consumer() {
  const { user, login, register, logout } = useAuth();
  return (
    <>
      <span>{user?.username ?? "guest"}</span>
      <button onClick={() => login("a@b.com", "pw")}>login</button>
      <button onClick={() => register("testing", "a@b.com", "pw")}>
        register
      </button>
      <button onClick={logout}>logout</button>
    </>
  );
}
const response = {
  userId: 1,
  username: "testing",
  email: "a@b.com",
  displayName: null,
  points: 0,
  levelId: 1,
  token: "token",
};
describe("AuthProvider", () => {
  beforeEach(() => vi.mocked(apiFetch).mockResolvedValue(response));
  it("restores a stored session", () => {
    localStorage.setItem("cinephile_token", "t");
    localStorage.setItem("cinephile_user", JSON.stringify(response));
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );
    expect(screen.getByText("testing")).toBeInTheDocument();
  });
  it("logs in and persists the session", async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );
    await userEvent.click(screen.getByText("login"));
    await waitFor(() =>
      expect(screen.getByText("testing")).toBeInTheDocument()
    );
    expect(apiFetch).toHaveBeenCalledWith(
      "/auth/login",
      expect.objectContaining({
        method: "POST",
        body: { email: "a@b.com", password: "pw" },
      })
    );
    expect(localStorage.getItem("cinephile_token")).toBe("token");
  });
  it("registers and logs out", async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );
    await userEvent.click(screen.getByText("register"));
    await waitFor(() =>
      expect(screen.getByText("testing")).toBeInTheDocument()
    );
    await userEvent.click(screen.getByText("logout"));
    expect(screen.getByText("guest")).toBeInTheDocument();
    expect(localStorage.getItem("cinephile_token")).toBeNull();
  });
  it("throws when useAuth is outside provider", () => {
    function Bad() {
      useAuth();
      return null;
    }
    expect(() => render(<Bad />)).toThrow(
      "useAuth must be used within an AuthProvider"
    );
  });
});
