import { apiFetch } from "./api";
import type { GamificationFeedback } from "./gamification-toast";

export type LogItem = {
  logId: number;
  movieId: number;
  tmdbId: number;
  title: string;
  posterUrl: string | null;
  watchedDate: string;
  rating: number | null;
  review: string | null;
  createdAt: string;
};

export type LogPayload = {
  watchedDate: string;
  rating: number | null;
  review: string | null;
};

export type LogCreatedResult = {
  log: LogItem;
  gamification: GamificationFeedback;
};

export function getLogs() {
  return apiFetch<LogItem[]>("/logs", { auth: true });
}

export function createLog(tmdbId: number, payload: LogPayload) {
  return apiFetch<LogCreatedResult>("/logs", {
    method: "POST",
    auth: true,
    body: { tmdbId, ...payload },
  });
}

export function updateLog(logId: number, payload: LogPayload) {
  return apiFetch<LogItem>(`/logs/${logId}`, {
    method: "PUT",
    auth: true,
    body: payload,
  });
}

export function deleteLog(logId: number) {
  return apiFetch<void>(`/logs/${logId}`, {
    method: "DELETE",
    auth: true,
  });
}
