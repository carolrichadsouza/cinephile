import { apiFetch } from "./api";
import type { GamificationFeedback } from "./gamification-toast";

export type WatchlistItem = {
  watchlistId: number;
  movieId: number;
  tmdbId: number;
  title: string;
  posterUrl: string | null;
  releaseDate: string | null;
  genres: string[];
  addedAt: string;
};

export type WatchlistAddedResult = {
  item: WatchlistItem;
  gamification: GamificationFeedback;
};

export function getWatchlist() {
  return apiFetch<WatchlistItem[]>("/watchlist", { auth: true });
}

export function addToWatchlist(tmdbId: number) {
  return apiFetch<WatchlistAddedResult>("/watchlist", {
    method: "POST",
    auth: true,
    body: { tmdbId },
  });
}

export function removeFromWatchlist(tmdbId: number) {
  return apiFetch<void>(`/watchlist/${tmdbId}`, {
    method: "DELETE",
    auth: true,
  });
}
