using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Movie
{
    public int MovieId { get; set; }

    public required int TmdbId { get; set; }

    [MaxLength(255)] public required string Title { get; set; }

    public string? PosterPath { get; set; }

    public DateOnly? ReleaseDate { get; set; }

    public int? RuntimeMinutes { get; set; }

    public DateTime CachedAt { get; set; } = DateTime.UtcNow;

    public string? Genres { get; set; }

    public List<Log> Logs { get; set; } = [];
    public List<Watchlist> WatchlistEntries { get; set; } = [];
}
