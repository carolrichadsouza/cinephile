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

public record TmdbGenre(
    [property: JsonPropertyName("id")] int Id,
    [property: JsonPropertyName("name")] string Name
);

public record TmdbMovieDetail(
    [property: JsonPropertyName("id")] int Id,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("poster_path")] string? PosterPath,
    [property: JsonPropertyName("release_date")] string? ReleaseDate,
    [property: JsonPropertyName("overview")] string? Overview,
    [property: JsonPropertyName("runtime")] int? Runtime,
    [property: JsonPropertyName("genres")] List<TmdbGenre>? Genres
);

public record TmdbCastMember(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("order")] int Order
);

public record TmdbCrewMember(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("job")] string Job
);

public record TmdbCreditsResponse(
    [property: JsonPropertyName("cast")] List<TmdbCastMember>? Cast,
    [property: JsonPropertyName("crew")] List<TmdbCrewMember>? Crew
);

public record TmdbWatchProvider(
    [property: JsonPropertyName("provider_name")] string ProviderName,
    [property: JsonPropertyName("logo_path")] string? LogoPath
);

public record TmdbWatchRegion(
    [property: JsonPropertyName("flatrate")] List<TmdbWatchProvider>? Flatrate,
    [property: JsonPropertyName("rent")] List<TmdbWatchProvider>? Rent,
    [property: JsonPropertyName("buy")] List<TmdbWatchProvider>? Buy
);

public record TmdbWatchProvidersResponse(
    [property: JsonPropertyName("results")] Dictionary<string, TmdbWatchRegion>? Results
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
    string? Overview,
    List<string> Genres,
    double AppRating,
    string? Director,
    List<string> Cast,
    List<string> WatchProviders
);

public record MovieReviewResponse(
    string Username,
    string? DisplayName,
    double? Rating,
    string Review,
    DateOnly WatchedDate
);
