import { apiFetch } from "./api";

export type MovieReview = {
  username: string;
  displayName: string | null;
  rating: number | null;
  review: string;
  watchedDate: string;
};

export function getMovieReviews(tmdbId: number) {
  return apiFetch<MovieReview[]>(`/movies/${tmdbId}/reviews`, { auth: true });
}
