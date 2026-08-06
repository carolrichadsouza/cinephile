import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AuthPage from "../AuthPage";
import { useAuth } from "../../lib/use-auth";

vi.mock("../../lib/use-auth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../components/mode-toggle", () => ({
  ModeToggle: () => <button>theme</button>,
}));

const login = vi.fn();
const register = vi.fn();

function setup(path = "/login") {
  vi.mocked(useAuth).mockReturnValue({
    login,
    register,
  } as never);

  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthPage />
    </MemoryRouter>
  );
}

describe("AuthPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits login credentials", async () => {
    const user = userEvent.setup();
    setup();

    await user.type(
      screen.getByLabelText("Email"),
      "testing@example.com"
    );

    await user.type(
      screen.getByLabelText("Password"),
      "Password123!"
    );

    const submitButton = screen
      .getAllByRole("button", { name: /sign in/i })
      .find(
        (button) => button.getAttribute("type") === "submit"
      )!;

    await user.click(submitButton);

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith(
        "testing@example.com",
        "Password123!"
      );
    });
  });

  it("validates registration password and then registers", async () => {
    const user = userEvent.setup();
    setup("/register");

    await user.type(
      screen.getByLabelText("Username"),
      "testing"
    );

    await user.type(
      screen.getByLabelText("Email"),
      "testing@example.com"
    );

    await user.type(
      screen.getByLabelText("Password"),
      "weak"
    );

    const submitButton = screen
      .getAllByRole("button", { name: /create account/i })
      .find(
        (button) => button.getAttribute("type") === "submit"
      )!;

    fireEvent.submit(submitButton.closest("form")!);

    expect(
      screen.getByText(
        /Password must be at least 8 characters/i
      )
    ).toBeInTheDocument();

    expect(register).not.toHaveBeenCalled();

    await user.clear(screen.getByLabelText("Password"));

    await user.type(
      screen.getByLabelText("Password"),
      "Password123!"
    );

    await user.click(submitButton);

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith(
        "testing",
        "testing@example.com",
        "Password123!"
      );
    });
  });
});