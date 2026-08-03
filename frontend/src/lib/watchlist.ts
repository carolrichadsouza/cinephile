import { apiFetch } from "./api";

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

export function getWatchlist() {
  return apiFetch<WatchlistItem[]>("/watchlist", { auth: true });
}

export function addToWatchlist(tmdbId: number) {
  return apiFetch<WatchlistItem>("/watchlist", {
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
