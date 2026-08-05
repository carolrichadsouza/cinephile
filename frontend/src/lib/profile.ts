import { apiFetch } from "./api";

export type UserProfile = {
  userId: number;
  username: string;
  email: string;
  displayName: string | null;
  bio: string | null;
  avatarPath: string | null;
  points: number;
  levelId: number;
  levelName: string;
  pointsForCurrentLevel: number;
  nextLevelName: string | null;
  pointsForNextLevel: number | null;
  currentStreak: number;
};

export type GenreBreakdownItem = { genre: string; percentage: number };
export type ActivityItem = { type: "achievement" | "watched" | "reviewed"; description: string; timestamp: string };

export type ProfileStats = {
  filmsWatched: number;
  inWatchlist: number;
  reviewsWritten: number;
  hoursWatched: number;
  favoriteGenre: string | null;
  watchedThisYear: number;
  currentStreak: number;
  averageRating: number | null;
  genreBreakdown: GenreBreakdownItem[];
  recentActivity: ActivityItem[];
};

export type Achievement = {
  code: string;
  name: string;
  details: string | null;
  points: number;
  earned: boolean;
  earnedAt: string | null;
  currentProgress: number;
  targetProgress: number;
};

export function getMyProfile() {
  return apiFetch<UserProfile>("/users/me", { auth: true });
}

export function getMyStats() {
  return apiFetch<ProfileStats>("/users/me/stats", { auth: true });
}

export function getAchievements() {
  return apiFetch<Achievement[]>("/achievements", { auth: true });
}
