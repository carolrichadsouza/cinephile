import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import Search from "../Search";
import { apiFetch, ApiError } from "../../lib/api";
vi.mock("../../lib/api", () => ({
  apiFetch: vi.fn(),
  ApiError: class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
    }
  },
}));
function setup() {
  return render(
    <MemoryRouter>
      <Search />
    </MemoryRouter>
  );
}
describe("Search page", () => {
  it("keeps search disabled for blank input and renders results", async () => {
    vi.mocked(apiFetch).mockResolvedValue([
      {
        tmdbId: 1,
        title: "Inception",
        posterUrl: null,
        releaseDate: "2010-01-01",
        genres: ["Sci-Fi"],
        overview: null,
      },
    ]);
    setup();
    const button = screen.getByRole("button", { name: "Search" });
    expect(button).toBeDisabled();
    await userEvent.type(
      screen.getByPlaceholderText("Search for a movie..."),
      " Inception "
    );
    await userEvent.click(button);
    const summary = screen.getByText(
      (_, element) =>
        element?.tagName === "P" &&
        element.textContent?.includes("1 result found")
    );
    expect(summary).toBeInTheDocument();
    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(apiFetch).toHaveBeenCalledWith("/movies/search?query=Inception", {
      auth: true,
    });
  });

  it("shows empty and API error states", async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([]);
    setup();
    await userEvent.type(
      screen.getByPlaceholderText("Search for a movie..."),
      "none"
    );
    await userEvent.click(screen.getByRole("button", { name: "Search" }));
    await screen.findByText("No movies matched your search.");
    vi.mocked(apiFetch).mockRejectedValueOnce(
      new ApiError(500, "Search failed")
    );
    await userEvent.clear(screen.getByPlaceholderText("Search for a movie..."));
    await userEvent.type(
      screen.getByPlaceholderText("Search for a movie..."),
      "error"
    );
    await userEvent.click(screen.getByRole("button", { name: "Search" }));
    await screen.findByText("Search failed");
  });
});
