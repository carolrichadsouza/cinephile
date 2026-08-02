import { useState, type FormEvent, type ChangeEvent } from "react";
import { SearchIcon, Film } from "lucide-react";
import { apiFetch, ApiError } from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

type MovieSearchResult = {
  tmdbId: number;
  title: string;
  posterUrl: string | null;
  releaseDate: string | null;
  genres: string[];
  overview: string | null;
};

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MovieSearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await apiFetch<MovieSearchResult[]>(
        `/movies/search?query=${encodeURIComponent(trimmed)}`,
        { auth: true }
      );
      setResults(data);
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto px-5 py-6">
      <h1 className="mb-1 text-3xl font-bold">Discover Films</h1>
      <p className="mb-4 text-lg text-muted-foreground">
        Search by title, genre, director, cast, release date and more.
      </p>

      <form onSubmit={handleSubmit} className="mb-5 flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-6 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            placeholder="Search for a movie..."
            className="h-15 pl-12 text-lg placeholder:text-lg"
          />
        </div>
        <Button className="text-lg h-15 w-25 px-4 py-2" type="submit" disabled={isLoading || !query.trim()}>
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </form>

      <hr className="my-6 border-border" />
      {hasSearched && !error && results.length !== 0 &&(
            <p className="mb-4 text-sm text-muted-foreground">
                {results.length} {results.length === 1 ? "result" : "results"} found
                {query && <> for <span className="font-medium">"{query}"</span></>}
            </p>
        )}

      {error && <p className="mb-2 text-sm text-destructive">{error}</p>}

      {!isLoading && hasSearched && results.length === 0 && !error && (
        <p className="mt-2 text-sm text-muted-foreground">No movies matched your search.</p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {results.map((movie) => (
          <div
            key={movie.tmdbId}
            className="group overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg"
          >
            <div className="aspect-[2/3] w-full bg-muted">
              {movie.posterUrl ? (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
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
              <p className="line-clamp-1 text-lg font-bold">{movie.title}</p>
              <p className="text-sm text-muted-foreground">
                {movie.releaseDate ? movie.releaseDate.slice(0, 4) : "—"}
                {movie.genres.length > 0 ? ` • ${movie.genres[0]}` : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


