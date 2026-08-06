import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ProtectedRoute from "../ProtectedRoute";
import { useAuth } from "../../lib/use-auth";
vi.mock("../../lib/use-auth", () => ({ useAuth: vi.fn() }));
function renderRoute() {
  return render(
    <MemoryRouter initialEntries={["/private"]}>
      <Routes>
        <Route path="/login" element={<div>Login page</div>} />
        <Route
          path="/private"
          element={
            <ProtectedRoute>
              <div>Private page</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}
describe("ProtectedRoute", () => {
  it("renders nothing while loading", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: true,
    } as never);
    const { container } = renderRoute();
    expect(container).toBeEmptyDOMElement();
  });
  it("redirects unauthenticated users", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: false,
    } as never);
    renderRoute();
    expect(screen.getByText("Login page")).toBeInTheDocument();
  });
  it("renders children for authenticated users", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { userId: 1 },
      isLoading: false,
    } as never);
    renderRoute();
    expect(screen.getByText("Private page")).toBeInTheDocument();
  });
});
