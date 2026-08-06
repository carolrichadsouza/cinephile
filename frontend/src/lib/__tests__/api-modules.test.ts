import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "../api";
import { getLogs, createLog, updateLog, deleteLog } from "../logs";
import { getMyProfile, getMyStats, getAchievements } from "../profile";
import { getMovieReviews } from "../reviews";
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from "../watchlist";
vi.mock("../api", () => ({ apiFetch: vi.fn() }));
const mocked = vi.mocked(apiFetch);
describe("API wrapper modules", () => {
  beforeEach(() => mocked.mockResolvedValue(undefined as never));
  it("uses the correct log endpoints and payloads", async () => {
    await getLogs();
    await createLog(10, {
      watchedDate: "2026-01-01",
      rating: 4,
      review: "Great",
    });
    await updateLog(3, { watchedDate: "2026-01-02", rating: 5, review: null });
    await deleteLog(3);
    expect(mocked).toHaveBeenNthCalledWith(1, "/logs", { auth: true });
    expect(mocked).toHaveBeenNthCalledWith(2, "/logs", {
      method: "POST",
      auth: true,
      body: {
        tmdbId: 10,
        watchedDate: "2026-01-01",
        rating: 4,
        review: "Great",
      },
    });
    expect(mocked).toHaveBeenNthCalledWith(
      3,
      "/logs/3",
      expect.objectContaining({ method: "PUT" })
    );
    expect(mocked).toHaveBeenNthCalledWith(4, "/logs/3", {
      method: "DELETE",
      auth: true,
    });
  });
  it("uses the correct profile, review and watchlist endpoints", async () => {
    await getMyProfile();
    await getMyStats();
    await getAchievements();
    await getMovieReviews(99);
    await getWatchlist();
    await addToWatchlist(99);
    await removeFromWatchlist(99);
    expect(mocked).toHaveBeenCalledWith("/users/me", { auth: true });
    expect(mocked).toHaveBeenCalledWith("/users/me/stats", { auth: true });
    expect(mocked).toHaveBeenCalledWith("/achievements", { auth: true });
    expect(mocked).toHaveBeenCalledWith("/movies/99/reviews", { auth: true });
    expect(mocked).toHaveBeenCalledWith("/watchlist", { auth: true });
    expect(mocked).toHaveBeenCalledWith("/watchlist", {
      method: "POST",
      auth: true,
      body: { tmdbId: 99 },
    });
    expect(mocked).toHaveBeenCalledWith("/watchlist/99", {
      method: "DELETE",
      auth: true,
    });
  });
});
