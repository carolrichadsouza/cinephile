import { useState, useEffect } from "react";
import { Film, X } from "lucide-react";
import { ApiError } from "../lib/api";
import { Link } from "react-router-dom";
import { getWatchlist, removeFromWatchlist, type WatchlistItem } from "../lib/watchlist";
import { Button } from "../components/ui/button";

export default function Watchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    getWatchlist()
      .then(setItems)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Couldn't load your watchlist."))
      .finally(() => setIsLoading(false));
  }, []);

  async function handleRemove(tmdbId: number) {
    setRemovingIds((prev) => new Set(prev).add(tmdbId));
    try {
      await removeFromWatchlist(tmdbId);
      setItems((prev) => prev.filter((item) => item.tmdbId !== tmdbId));
    } catch {
        //Button just stays in its previous state, no destructive UI needed.
    } finally {
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(tmdbId);
        return next;
      });
    }
  }

  return (
    <div className="mx-auto px-5 py-6">
      <h1 className="mb-1 text-3xl font-bold">Your Watchlist</h1>
      {items.length > 0 && (
        <p className="mb-4 text-lg text-muted-foreground">
          {items.length} movie{items.length !== 1 ? "s" : ""} waiting for the perfect night.
        </p>
      )}

      <hr className="my-6 border-border" />

      {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {!isLoading && !error && items.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nothing here yet! Search for a movie and tap the bookmark icon to add it.
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((item) => (
          <div
            key={item.watchlistId}
            className="group relative overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg"
          >
            <Link
              to={`/movies/${item.tmdbId}`}
              className="block"
              aria-label={`View details for ${item.title}`}
            >

            <div className="aspect-[2/3] w-full bg-muted">
              {item.posterUrl ? (
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Film className="size-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="p-2.5">
              <p className="line-clamp-1 text-lg font-bold">{item.title}</p>
              <p className="text-sm text-muted-foreground">
                {item.releaseDate ? item.releaseDate.slice(0, 4) : "—"}
              </p>
            </div>
            </Link>
            <Button
              type="button"
              onClick={() => handleRemove(item.tmdbId)}
              disabled={removingIds.has(item.tmdbId)}
              aria-label="Remove from watchlist"
              className="absolute right-2 top-2 z-10 flex size-8 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50"
            >
              <X className="size-4" />
            </Button>
            </div>
        ))}
      </div>
    </div>
  );
}
