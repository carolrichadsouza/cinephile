import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Star,
  Film,
  Play,
  Check,
  PenSquare,
  Bookmark,
} from "lucide-react";
import { apiFetch, ApiError } from "../lib/api";
import { Button } from "../components/ui/button";

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


export default function MovieDetail() {
  const { tmdbId } = useParams<{ tmdbId: string }>();
const [movie, setMovie] = useState<MovieDetailResponse | null>(null);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  if (!tmdbId) return;

  apiFetch<MovieDetailResponse>(`/movies/${tmdbId}`, { auth: true })
    .then((data) => {
      setMovie(data);
      setError(null);
    })
    .catch((err) => {
      setMovie(null);
      setError(
        err instanceof ApiError
          ? err.message
          : "Couldn't load this movie."
      );
    })
    .finally(() => setIsLoading(false));
}, [tmdbId]);

  if (isLoading) {
    return <div className="mx-auto px-5 py-6 text-sm text-muted-foreground">Loading...</div>;
  }

  if (error || !movie) {
    return (
      <div className="mx-auto px-5 py-6">
        <p className="text-sm text-destructive">{error ?? "Movie not found."}</p>
        <Link to="/search" className="mt-2 inline-block text-sm text-gold hover:underline">
          Back to search
        </Link>
      </div>
    );
  }

  const year = movie.releaseDate ? movie.releaseDate.slice(0, 4) : null;

  return (
    <div className="mx-auto px-5 py-6">
      <Link to="/search" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back
      </Link>

      {/* Hero */}
      <div className="mb-8 rounded-xl border border-border bg-card">
        <div className="relative h-56 overflow-hidden rounded-t-xl bg-muted sm:h-72">
          {movie.posterUrl ? (
            <img src={movie.posterUrl} alt="" className="h-full w-full object-cover opacity-60 blur-sm" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Film className="size-10 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:p-6">
          <div className="-mt-16 relative z-10 w-32 shrink-0 overflow-hidden rounded-lg border border-border bg-muted shadow-lg sm:-mt-24 sm:w-40">
            {movie.posterUrl ? (
              <img src={movie.posterUrl} alt={movie.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Film className="size-8 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="font-heading text-3xl font-semibold">{movie.title}</h1>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {year && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-4" /> {year}
                </span>
              )}
              {movie.runtimeMinutes && (
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4" /> {movie.runtimeMinutes} min
                </span>
              )}
                <span className="flex items-center gap-1.5">
                  <Star className="size-4 fill-gold text-gold" /> {movie.appRating != null ? movie.appRating.toFixed(1) : "0.0"}
                </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
              {movie.director && (
                <div>
                  <p className="font-semibold">Director</p>
                  <p className="text-muted-foreground">{movie.director}</p>
                </div>
              )}
              {movie.genres.length > 0 && (
                <div>
                  <p className="font-semibold">Genres</p>
                  <p className="text-muted-foreground">{movie.genres.join(", ")}</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" size="sm" disabled title="Coming soon">
                <Play className="size-4" /> Watch Trailer
              </Button>
              <Button variant="outline" size="sm" disabled title="Coming soon">
                <Check className="size-4" /> Mark as Watched
              </Button>
              <Button variant="outline" size="sm" disabled title="Coming soon">
                <PenSquare className="size-4" /> Journal Entry
              </Button>
              <Button variant="outline" size="sm" disabled title="Coming soon">
                <Bookmark className="size-4" /> Add to Watchlist
              </Button>
            </div>
          </div>
        </div>
      </div>

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
              <p className="text-sm text-muted-foreground">Cast info unavailable.</p>
            )}
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-2 text-sm font-semibold">Where to Watch</p>
            <p className="text-sm text-muted-foreground">
                {movie.watchProviders && movie.watchProviders.length > 0
                    ? movie.watchProviders.join(", ")
                    : "Not streaming in your region."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-dashed border-border bg-card/50 p-4">
        <p className="mb-1 text-sm font-semibold">Your Log</p>
        <p className="text-sm text-muted-foreground">
          No logs.
        </p>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-xl font-bold">Community Reviews</h2>
        <p className="text-sm text-muted-foreground">No Reviews.</p>
      </div>
    </div>
  );
}