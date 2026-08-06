import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import Dashboard from "../Dashboard";
import { getMyProfile, getMyStats, getAchievements } from "../../lib/profile";
import { apiFetch } from "../../lib/api";
vi.mock("../../lib/profile", () => ({
  getMyProfile: vi.fn(),
  getMyStats: vi.fn(),
  getAchievements: vi.fn(),
}));
vi.mock("../../lib/api", () => ({ apiFetch: vi.fn() }));
vi.mock("../../components/ui/carousel", () => ({
  Carousel: ({ children }: any) => <div>{children}</div>,
  CarouselContent: ({ children }: any) => <div>{children}</div>,
  CarouselItem: ({ children }: any) => <div>{children}</div>,
  CarouselNext: () => null,
  CarouselPrevious: () => null,
}));
const profile = {
  userId: 1,
  username: "testing",
  email: "c@e.com",
  displayName: "Testing",
  bio: null,
  avatarPath: null,
  points: 50,
  levelId: 2,
  levelName: "Reviewer",
  pointsForCurrentLevel: 20,
  nextLevelName: "Critic",
  pointsForNextLevel: 100,
  currentStreak: 3,
};
const stats = {
  filmsWatched: 4,
  inWatchlist: 2,
  reviewsWritten: 3,
  hoursWatched: 8,
  favoriteGenre: "Drama",
  watchedThisYear: 4,
  currentStreak: 3,
  averageRating: 4,
  genreBreakdown: [],
  recentActivity: [],
};
const badge = {
  code: "FIRST",
  name: "First Film",
  details: "Log one",
  points: 10,
  earned: true,
  earnedAt: new Date().toISOString(),
  currentProgress: 1,
  targetProgress: 1,
};
describe("Dashboard", () => {
  it("renders user progress, stats and movie sections", async () => {
    vi.mocked(getMyProfile).mockResolvedValue(profile);
    vi.mocked(getMyStats).mockResolvedValue(stats as never);
    vi.mocked(getAchievements).mockResolvedValue([badge]);
    vi.mocked(apiFetch)
      .mockResolvedValueOnce([
        {
          tmdbId: 1,
          title: "Trending Film",
          posterUrl: null,
          releaseDate: "2026-01-01",
          genres: ["Drama"],
          overview: null,
        },
      ])
      .mockResolvedValueOnce([
        {
          tmdbId: 2,
          title: "Recommended Film",
          posterUrl: null,
          releaseDate: "2025-01-01",
          genres: ["Action"],
          overview: null,
        },
      ]);
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(await screen.findByText("Testing")).toBeInTheDocument();
    expect(screen.getByText("First Film")).toBeInTheDocument();
    expect(screen.getByText("Recommended Film")).toBeInTheDocument();
    expect(screen.getByText("Trending Film")).toBeInTheDocument();
  });
  it("renders dashboard failure state", async () => {
    vi.mocked(getMyProfile).mockRejectedValue(new Error());
    vi.mocked(getMyStats).mockRejectedValue(new Error());
    vi.mocked(getAchievements).mockRejectedValue(new Error());
    vi.mocked(apiFetch).mockRejectedValue(new Error());
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(
      await screen.findByText("Couldn't load your dashboard.")
    ).toBeInTheDocument();
  });
});
