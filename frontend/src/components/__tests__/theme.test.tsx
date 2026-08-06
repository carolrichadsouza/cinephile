import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ThemeProvider } from "../theme-provider";
import { ModeToggle } from "../mode-toggle";
describe("theme switching", () => {
  it("applies and persists the default/theme toggle", async () => {
    render(
      <ThemeProvider defaultTheme="light" storageKey="test-theme">
        <ModeToggle />
      </ThemeProvider>
    );
    expect(document.documentElement).toHaveClass("light");
    await userEvent.click(screen.getByRole("button", { name: "Toggle theme" }));
    expect(document.documentElement).toHaveClass("dark");
    expect(localStorage.getItem("test-theme")).toBe("dark");
  });
});
