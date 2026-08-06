import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Profile from "../Profile";
import { getMyProfile, getMyStats, getAchievements } from "../../lib/profile";
import { useAuth } from "../../lib/use-auth";
vi.mock("../../lib/profile", () => ({
  getMyProfile: vi.fn(),
  getMyStats: vi.fn(),
  getAchievements: vi.fn(),
}));
vi.mock("../../lib/use-auth", () => ({ useAuth: vi.fn() }));
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
  averageRating: 4.25,
  genreBreakdown: [{ genre: "Drama", percentage: 60 }],
  recentActivity: [
    {
      type: "watched",
      description: "Watched Arrival",
      timestamp: new Date().toISOString(),
    },
  ],
};
const achievements = [
  {
    code: "FIRST",
    name: "First Film",
    details: "Log one",
    points: 10,
    earned: true,
    earnedAt: new Date().toISOString(),
    currentProgress: 1,
    targetProgress: 1,
  },
];
describe("Profile page", () => {
  it("renders profile, stats and logout", async () => {
    const logout = vi.fn();
    vi.mocked(useAuth).mockReturnValue({ logout } as never);
    vi.mocked(getMyProfile).mockResolvedValue(profile);
    vi.mocked(getMyStats).mockResolvedValue(stats as never);
    vi.mocked(getAchievements).mockResolvedValue(achievements);
    render(<Profile />);
    expect(await screen.findByText("Testing")).toBeInTheDocument();
    expect(screen.getByText("4.3")).toBeInTheDocument();
    expect(screen.getByText("1 of 1 unlocked")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /log out/i }));
    expect(logout).toHaveBeenCalled();
  });
  it("renders failure state", async () => {
    vi.mocked(useAuth).mockReturnValue({ logout: vi.fn() } as never);
    vi.mocked(getMyProfile).mockRejectedValue(new Error());
    vi.mocked(getMyStats).mockRejectedValue(new Error());
    vi.mocked(getAchievements).mockRejectedValue(new Error());
    render(<Profile />);
    expect(
      await screen.findByText("Couldn't load your profile.")
    ).toBeInTheDocument();
  });
});
