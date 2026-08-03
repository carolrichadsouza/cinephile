namespace backend.DTOs;

public record AddWatchlistRequest(int TmdbId);

public record WatchlistItemResponse(
    int WatchlistId,
    int MovieId,
    int TmdbId,
    string Title,
    string? PosterUrl,
    DateOnly? ReleaseDate,
    DateTime AddedAt
);
