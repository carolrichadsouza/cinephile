import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Calendar,
  CalendarDays,
  Check,
  Clock,
  Film,
  PenSquare,
  Play,
  Trash2,
} from "lucide-react";

import { apiFetch, ApiError } from "../lib/api";
import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
} from "../lib/watchlist";
import {
  createLog,
  deleteLog,
  getLogs,
  updateLog,
  type LogItem,
  type LogPayload,
} from "../lib/logs";

import { Button } from "../components/ui/button";
import { Calendar as CalendarPicker } from "../components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Rating } from "../components/ui/rating";
import { Textarea } from "../components/ui/textarea";
import CommunityReviews from "../components/CommunityReviews";
import { showGamificationToasts } from "../lib/gamification-toast";

type MovieDetailResponse = {
  movieId: number;
  tmdbId: number;
  title: string;
  posterUrl: string | null;
  releaseDate: string | null;
  runtimeMinutes: number | null;
  overview: string | null;
  genres: string[];
  appRating: number;
  director: string | null;
  cast: string[];
  watchProviders: string[];
};

function dateToIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isoDateToDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function todayIsoDate(): string {
  return dateToIsoDate(new Date());
}

export default function MovieDetail() {
  const { tmdbId } = useParams<{ tmdbId: string }>();

  const [movie, setMovie] = useState<MovieDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [watchlistedIds, setWatchlistedIds] = useState<Set<number>>(
    new Set(),
  );
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());

  const [log, setLog] = useState<LogItem | null>(null);
  const [isQuickLogging, setIsQuickLogging] = useState(false);
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [watchedDate, setWatchedDate] = useState<Date>(new Date());
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState("");

  useEffect(() => {
    getWatchlist()
      .then((items) => {
        setWatchlistedIds(new Set(items.map((item) => item.tmdbId)));
      })
      .catch(() => {
        // The page can still load if the watchlist request fails.
      });
  }, []);

  useEffect(() => {
    if (!tmdbId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);

    apiFetch<MovieDetailResponse>(`/movies/${tmdbId}`, {
      auth: true,
    })
      .then((data) => {
        setMovie(data);
        setError(null);
      })
      .catch((requestError) => {
        setMovie(null);
        setError(
          requestError instanceof ApiError
            ? requestError.message
            : "Couldn't load this movie.",
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [tmdbId]);

  useEffect(() => {
    if (!tmdbId) return;

    getLogs()
      .then((logs) => {
        const existing =
          logs.find((item) => item.tmdbId === Number(tmdbId)) ?? null;

        setLog(existing);

        if (existing) {
          setWatchedDate(
            isoDateToDate(existing.watchedDate.slice(0, 10)),
          );
          setRating(existing.rating);
          setReview(existing.review ?? "");
        } else {
          setWatchedDate(new Date());
          setRating(null);
          setReview("");
        }
      })
      .catch(() => {
        setLog(null);
        setWatchedDate(new Date());
        setRating(null);
        setReview("");
      });
  }, [tmdbId]);

  async function toggleWatchlist(movieTmdbId: number) {
    if (pendingIds.has(movieTmdbId)) return;

    setPendingIds((previous) => {
      const next = new Set(previous);
      next.add(movieTmdbId);
      return next;
    });

    const isCurrentlyWatchlisted = watchlistedIds.has(movieTmdbId);

    try {
      if (isCurrentlyWatchlisted) {
        await removeFromWatchlist(movieTmdbId);

        setWatchlistedIds((previous) => {
          const next = new Set(previous);
          next.delete(movieTmdbId);
          return next;
        });
      } else {
        const result = await addToWatchlist(movieTmdbId);
        showGamificationToasts(result.gamification);
 
        setWatchlistedIds((previous) => {
          const next = new Set(previous);
          next.add(movieTmdbId);
          return next;
        });
      }
    } catch {
      // Keep the previous watchlist state if the request fails.
    } finally {
      setPendingIds((previous) => {
        const next = new Set(previous);
        next.delete(movieTmdbId);
        return next;
      });
    }
  }

  function openNewJournalEntry() {
    setWatchedDate(new Date());
    setRating(null);
    setReview("");
    setFormError(null);
    setIsLogDialogOpen(true);
  }

  function openEditLog() {
    if (!log) return;

    setWatchedDate(
      isoDateToDate(log.watchedDate.slice(0, 10)),
    );
    setRating(log.rating);
    setReview(log.review ?? "");
    setFormError(null);
    setIsLogDialogOpen(true);
  }

  async function handleMarkAsWatched() {
    if (!movie || log || isQuickLogging) return;

    setIsQuickLogging(true);
    setFormError(null);

    try {
      const result = await createLog(movie.tmdbId, {
        watchedDate: todayIsoDate(),
        rating: null,
        review: null,
      });
 
      setLog(result.log);
      showGamificationToasts(result.gamification);
 
      setWatchedDate(isoDateToDate(result.log.watchedDate.slice(0, 10)));
      setRating(result.log.rating);
      setReview(result.log.review ?? "");
 
      setWatchlistedIds((previous) => {
        const next = new Set(previous);
        next.delete(movie.tmdbId);
        return next;
      });
    } catch (requestError) {
      setFormError(
        requestError instanceof ApiError
          ? requestError.message
          : "Couldn't log this movie.",
      );
    } finally {
      setIsQuickLogging(false);
    }
  }

  async function handleSaveLog() {
    if (!movie) return;

    setFormError(null);

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (watchedDate > today) {
      setFormError("Watched date cannot be in the future.");
      return;
    }

    const payload: LogPayload = {
      watchedDate: dateToIsoDate(watchedDate),
      rating,
      review: review.trim() === "" ? null : review.trim(),
    };

    setIsSaving(true);

    try {
      let saved: LogItem;
 
      if (log) {
        saved = await updateLog(log.logId, payload);
      } else {
        const result = await createLog(movie.tmdbId, payload);
        saved = result.log;
        showGamificationToasts(result.gamification);
      }
 
      setLog(saved);
      setIsLogDialogOpen(false);

      setWatchedDate(
        isoDateToDate(saved.watchedDate.slice(0, 10)),
      );
      setRating(saved.rating);
      setReview(saved.review ?? "");

      // Creating a log removes the movie from the watchlist.
      setWatchlistedIds((previous) => {
        const next = new Set(previous);
        next.delete(movie.tmdbId);
        return next;
      });
    } catch (requestError) {
      setFormError(
        requestError instanceof ApiError
          ? requestError.message
          : "Couldn't save your log.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteLog() {
    if (!log) return;

    setIsSaving(true);
    setFormError(null);

    try {
      await deleteLog(log.logId);

      setLog(null);
      setIsLogDialogOpen(false);
      setWatchedDate(new Date());
      setRating(null);
      setReview("");
    } catch (requestError) {
      setFormError(
        requestError instanceof ApiError
          ? requestError.message
          : "Couldn't delete your log.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto px-5 py-6 text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="mx-auto px-5 py-6">
        <p className="text-sm text-destructive">
          {error ?? "Movie not found."}
        </p>

        <Link
          to="/search"
          className="mt-2 inline-block text-sm text-gold hover:underline"
        >
          Back to search
        </Link>
      </div>
    );
  }

  const year = movie.releaseDate
    ? movie.releaseDate.slice(0, 4)
    : null;

  const isWatchlisted = watchlistedIds.has(movie.tmdbId);
  const isWatchlistPending = pendingIds.has(movie.tmdbId);

  return (
    <div className="mx-auto px-5 py-6">
      <Link
        to="/search"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>

      {/* Movie hero */}
      <div className="mb-8 rounded-xl border border-border bg-card">
        <div className="relative h-56 overflow-hidden rounded-t-xl bg-muted sm:h-72">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt=""
              className="h-full w-full object-cover opacity-60 blur-sm"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Film className="size-10 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:p-6">
          <div className="relative z-10 -mt-16 w-32 shrink-0 overflow-hidden rounded-lg border border-border bg-muted shadow-lg sm:-mt-24 sm:w-40">
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[2/3] h-full w-full items-center justify-center">
                <Film className="size-8 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="font-heading text-3xl font-semibold">
              {movie.title}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {year && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-4" />
                  {year}
                </span>
              )}

              {movie.runtimeMinutes != null && (
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4" />
                  {movie.runtimeMinutes} min
                </span>
              )}

              <span className="flex items-center gap-1.5">
                <Rating rating={movie.appRating} />
                <span>{movie.appRating.toFixed(1)}</span>
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
              {movie.director && (
                <div>
                  <p className="font-semibold">Director</p>
                  <p className="text-muted-foreground">
                    {movie.director}
                  </p>
                </div>
              )}

              {movie.genres.length > 0 && (
                <div>
                  <p className="font-semibold">Genres</p>
                  <p className="text-muted-foreground">
                    {movie.genres.join(", ")}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled
                title="Coming soon"
              >
                <Play className="size-4" />
                Watch Trailer
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAsWatched}
                disabled={Boolean(log) || isQuickLogging}
                title={log ? "Already logged" : undefined}
              >
                <Check className="size-4" />
                {isQuickLogging
                  ? "Marking..."
                  : log
                    ? "Watched"
                    : "Mark as Watched"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={log ? openEditLog : openNewJournalEntry}
              >
                <PenSquare className="size-4" />
                {log ? "Edit Log" : "Journal Entry"}
              </Button>

              {!log && (
                <Button
                  type="button"
                  variant={isWatchlisted ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleWatchlist(movie.tmdbId)}
                  disabled={isWatchlistPending}
                >
                  {isWatchlisted ? (
                    <>
                      <BookmarkCheck className="size-4 text-gold" />
                      Remove from Watchlist
                    </>
                  ) : (
                    <>
                      <Bookmark className="size-4" />
                      Add to Watchlist
                    </>
                  )}
                </Button>
              )}
            </div>

            {formError && !isLogDialogOpen && (
              <p className="mt-3 text-sm text-destructive">
                {formError}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Movie information */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-xl font-bold">Synopsis</h2>

          <div className="rounded-lg border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
            {movie.overview || "No synopsis available."}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-2 text-sm font-semibold">Starring</p>

            {movie.cast.length > 0 ? (
              <ul className="space-y-1 text-sm text-muted-foreground">
                {movie.cast.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Cast info unavailable.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-2 text-sm font-semibold">
              Where to Watch
            </p>

            <p className="text-sm text-muted-foreground">
              {movie.watchProviders.length > 0
                ? movie.watchProviders.join(", ")
                : "Not streaming in your region."}
            </p>
          </div>
        </div>
      </div>

      {/* Only displayed after the movie has been logged */}
      {log && (
        <div className="mt-6 rounded-lg border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="text-sm font-semibold">Your Log</p>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={openEditLog}
              >
                <PenSquare className="size-4" />
                Edit
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleDeleteLog}
                disabled={isSaving}
                aria-label="Delete log"
                className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Watched{" "}
            {format(
              isoDateToDate(log.watchedDate.slice(0, 10)),
              "PPP",
            )}
          </p>

          {log.rating != null && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Rating rating={log.rating} />

              <span className="text-sm text-muted-foreground">
                {log.rating}/5
              </span>
            </div>
          )}

          {log.review && (
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">
              {log.review}
            </p>
          )}
        </div>
      )}

      <div className="mt-6">
        <h2 className="mb-3 text-xl font-bold">
          Community Reviews
        </h2>
          <CommunityReviews tmdbId={movie.tmdbId} />
      </div>

      {/* Edit journal entry dialog */}
      <Dialog
        open={isLogDialogOpen}
        onOpenChange={(open) => {
          if (isSaving) return;

          setIsLogDialogOpen(open);
          setFormError(null);
        }}
      >
        <DialogContent className="border border-border bg-background shadow-xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {log
                ? "Edit journal entry"
                : "Create journal entry"}
            </DialogTitle>

            <DialogDescription>
              Record when you watched {movie.title}, add a rating,
              and write an optional review.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label>Watched date</Label>

              <Popover>
                <PopoverTrigger>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarDays className="mr-2 size-4" />
                    {format(watchedDate, "PPP")}
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  className="w-auto p-0"
                  align="start"
                >
                  <CalendarPicker
                    mode="single"
                    selected={watchedDate}
                    onSelect={(date) => {
                      if (date) {
                        setWatchedDate(date);
                      }
                    }}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(23, 59, 59, 999);

                      return date > today;
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label>Your rating</Label>

                {rating != null && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setRating(null)}
                    className="h-auto px-2 py-1 text-xs text-muted-foreground"
                  >
                    Clear
                  </Button>
                )}
              </div>

              <Rating
                rating={rating ?? 0}
                editable
                onRatingChange={(value: number) => {
                  setRating(value);
                }}
              />

              <p className="text-xs text-muted-foreground">
                {rating == null
                  ? "No rating selected"
                  : `${rating} out of 5 stars`}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="review">Review</Label>

              <Textarea
                id="review"
                value={review}
                onChange={(event) => {
                  setReview(event.target.value);
                }}
                rows={5}
                maxLength={4000}
                placeholder="What did you think?"
              />

              <p className="text-right text-xs text-muted-foreground">
                {review.length}/4000
              </p>
            </div>

            {formError && (
              <p className="text-sm text-destructive">
                {formError}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            {log && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleDeleteLog}
                disabled={isSaving}
                className="mr-auto border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="size-4" />
                Delete log
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsLogDialogOpen(false);
                setFormError(null);
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleSaveLog}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save entry"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}