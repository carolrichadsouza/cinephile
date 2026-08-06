import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MovieDetail from "../MovieDetail";
import { apiFetch, ApiError } from "../../lib/api";
import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
} from "../../lib/watchlist";
import { createLog, deleteLog, getLogs, updateLog } from "../../lib/logs";
import { showGamificationToasts } from "../../lib/gamification-toast";

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
vi.mock("../../lib/watchlist", () => ({
  getWatchlist: vi.fn(),
  addToWatchlist: vi.fn(),
  removeFromWatchlist: vi.fn(),
}));
vi.mock("../../lib/logs", () => ({
  getLogs: vi.fn(),
  createLog: vi.fn(),
  updateLog: vi.fn(),
  deleteLog: vi.fn(),
}));
vi.mock("../../lib/gamification-toast", () => ({
  showGamificationToasts: vi.fn(),
}));
vi.mock("../../components/CommunityReviews", () => ({
  default: ({ tmdbId }: { tmdbId: number }) => <div>Reviews for {tmdbId}</div>,
}));

const movie = {
  movieId: 1,
  tmdbId: 99,
  title: "Arrival",
  posterUrl: null,
  releaseDate: "2016-11-11",
  runtimeMinutes: 116,
  overview: "Aliens arrive.",
  genres: ["Sci-Fi", "Drama"],
  appRating: 4.2,
  director: "Denis Villeneuve",
  cast: ["Amy Adams"],
  watchProviders: ["Netflix"],
};
const feedback = {
  pointsAwarded: 10,
  leveledUp: false,
  newLevelName: null,
  unlockedAchievements: [],
};
const log = {
  logId: 5,
  movieId: 1,
  tmdbId: 99,
  title: "Arrival",
  posterUrl: null,
  watchedDate: "2026-08-01",
  rating: null,
  review: null,
  createdAt: "2026-08-01",
};
function setup() {
  return render(
    <MemoryRouter initialEntries={["/movies/99"]}>
      <Routes>
        <Route path="/movies/:tmdbId" element={<MovieDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("MovieDetail page", () => {
  beforeEach(() => {
    vi.mocked(apiFetch).mockResolvedValue(movie);
    vi.mocked(getWatchlist).mockResolvedValue([]);
    vi.mocked(getLogs).mockResolvedValue([]);
  });
  it("loads and displays movie information", async () => {
    setup();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(await screen.findByText("Arrival")).toBeInTheDocument();
    expect(screen.getByText("Aliens arrive.")).toBeInTheDocument();
    expect(screen.getByText("Amy Adams")).toBeInTheDocument();
    expect(screen.getByText("Netflix")).toBeInTheDocument();
    expect(screen.getByText("Reviews for 99")).toBeInTheDocument();
    expect(apiFetch).toHaveBeenCalledWith("/movies/99", { auth: true });
  });
  it("adds and removes a movie from the watchlist", async () => {
    vi.mocked(addToWatchlist).mockResolvedValue({
      item: {} as never,
      gamification: feedback,
    });
    vi.mocked(removeFromWatchlist).mockResolvedValue(undefined);
    setup();
    await userEvent.click(
      await screen.findByRole("button", { name: /Add to Watchlist/i })
    );
    expect(addToWatchlist).toHaveBeenCalledWith(99);
    expect(showGamificationToasts).toHaveBeenCalledWith(feedback);
    await userEvent.click(
      screen.getByRole("button", { name: /Remove from Watchlist/i })
    );
    expect(removeFromWatchlist).toHaveBeenCalledWith(99);
  });
  it("quick logs a movie and allows deletion", async () => {
    vi.mocked(createLog).mockResolvedValue({ log, gamification: feedback });
    vi.mocked(deleteLog).mockResolvedValue(undefined);
    setup();
    await userEvent.click(
      await screen.findByRole("button", { name: /Mark as Watched/i })
    );
    await waitFor(() =>
      expect(createLog).toHaveBeenCalledWith(
        99,
        expect.objectContaining({ rating: null, review: null })
      )
    );
    expect(await screen.findByText("Your Log")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Delete log" }));
    await waitFor(() => expect(deleteLog).toHaveBeenCalledWith(5));
    expect(screen.queryByText("Your Log")).not.toBeInTheDocument();
  });
  it("loads an existing log and updates it through the journal dialog", async () => {
    vi.mocked(getLogs).mockResolvedValue([
      { ...log, rating: 4, review: "Great film" },
    ]);
    vi.mocked(updateLog).mockResolvedValue({
      ...log,
      rating: 4,
      review: "Updated review",
    });
    setup();
    expect(await screen.findByText("Great film")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Edit Log/i }));
    const review = await screen.findByPlaceholderText("What did you think?");
    await userEvent.clear(review);
    await userEvent.type(review, "Updated review");
    await userEvent.click(screen.getByRole("button", { name: "Save entry" }));
    await waitFor(() =>
      expect(updateLog).toHaveBeenCalledWith(
        5,
        expect.objectContaining({ rating: 4, review: "Updated review" })
      )
    );
  });
  it("shows API errors", async () => {
    vi.mocked(apiFetch).mockRejectedValue(
      new ApiError(404, "Movie unavailable")
    );
    setup();
    expect(await screen.findByText("Movie unavailable")).toBeInTheDocument();
    expect(screen.getByText("Back to search")).toBeInTheDocument();
  });
});
