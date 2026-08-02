using System.Text.Json.Serialization;

namespace backend.DTOs;

public record TmdbSearchResponse(
    [property: JsonPropertyName("results")] List<TmdbMovieResult> Results
);

public record TmdbMovieResult(
    [property: JsonPropertyName("id")] int Id,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("poster_path")] string? PosterPath,
    [property: JsonPropertyName("release_date")] string? ReleaseDate,
    [property: JsonPropertyName("genre_ids")] List<int> GenreIds,
    [property: JsonPropertyName("overview")] string? Overview
);

public record TmdbMovieDetail(
    [property: JsonPropertyName("id")] int Id,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("poster_path")] string? PosterPath,
    [property: JsonPropertyName("release_date")] string? ReleaseDate,
    [property: JsonPropertyName("overview")] string? Overview,
    [property: JsonPropertyName("runtime")] int? Runtime
);

public record MovieSearchResult(
    int TmdbId,
    string Title,
    string? PosterUrl,
    string? ReleaseDate,
    string[] Genres,
    string? Overview
);

public record MovieResponse(
    int MovieId,
    int TmdbId,
    string Title,
    string? PosterUrl,
    DateOnly? ReleaseDate,
    int? RuntimeMinutes,
    string? Overview
);
