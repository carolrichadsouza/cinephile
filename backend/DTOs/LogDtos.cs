using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public record CreateLogRequest(
    [Required] int TmdbId,
    [Required] DateOnly WatchedDate,
    [Range(0.5, 5)] double? Rating,
    [MaxLength(4000)] string? Review
);

public record UpdateLogRequest(
    [Required] DateOnly WatchedDate,
    [Range(0.5, 5)] double? Rating,
    [MaxLength(4000)] string? Review
);

public record LogResponse(
    int LogId,
    int MovieId,
    int TmdbId,
    string Title,
    string? PosterUrl,
    DateOnly WatchedDate,
    double? Rating,
    string? Review,
    DateTime CreatedAt
);

public record LogCreatedResponse(LogResponse Log, GamificationFeedback Gamification);
