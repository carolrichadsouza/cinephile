import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import Watchlist from "../Watchlist";
import { getWatchlist, removeFromWatchlist } from "../../lib/watchlist";
vi.mock("../../lib/watchlist", () => ({
  getWatchlist: vi.fn(),
  removeFromWatchlist: vi.fn(),
}));
function setup() {
  return render(
    <MemoryRouter>
      <Watchlist />
    </MemoryRouter>
  );
}
describe("Watchlist page", () => {
  it("renders and removes an item", async () => {
    vi.mocked(getWatchlist).mockResolvedValue([
      {
        watchlistId: 1,
        movieId: 1,
        tmdbId: 10,
        title: "Arrival",
        posterUrl: null,
        releaseDate: "2016-01-01",
        genres: ["Sci-Fi"],
        addedAt: "2026-01-01",
      },
    ]);
    vi.mocked(removeFromWatchlist).mockResolvedValue(undefined);
    setup();
    expect(await screen.findByText("Arrival")).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "Remove from watchlist" })
    );
    expect(removeFromWatchlist).toHaveBeenCalledWith(10);
    expect(screen.queryByText("Arrival")).not.toBeInTheDocument();
  });
  it("renders empty and error states", async () => {
    vi.mocked(getWatchlist).mockResolvedValue([]);
    const { unmount } = setup();
    expect(await screen.findByText(/Nothing here yet/)).toBeInTheDocument();
    unmount();
    vi.mocked(getWatchlist).mockRejectedValue(new Error());
    setup();
    expect(
      await screen.findByText("Couldn't load your watchlist.")
    ).toBeInTheDocument();
  });
});
