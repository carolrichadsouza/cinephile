using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/movies")]
[Authorize]
public class MoviesController(ITmdbService tmdb, IMovieCacheService movieCache, CinephileDbContext db) : ControllerBase
{
    private static readonly IReadOnlyDictionary<int, string> GenreNames = new Dictionary<int, string>
    {
        [28] = "Action",
        [12] = "Adventure",
        [16] = "Animation",
        [35] = "Comedy",
        [80] = "Crime",
        [99] = "Documentary",
        [18] = "Drama",
        [10751] = "Family",
        [14] = "Fantasy",
        [36] = "History",
        [27] = "Horror",
        [10402] = "Music",
        [9648] = "Mystery",
        [10749] = "Romance",
        [878] = "Science Fiction",
        [10770] = "TV Movie",
        [53] = "Thriller",
        [10752] = "War",
        [37] = "Western"
    };

    [HttpGet("search")]
    public async Task<ActionResult<List<MovieSearchResult>>> Search([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return BadRequest(new { message = "A search query is required." });

        var results = await tmdb.SearchMoviesAsync(query);

        return Ok(results.Select(ToSearchResult).ToList());
    }

    [HttpGet("trending")]
    public async Task<ActionResult<List<MovieSearchResult>>> GetTrending()
    {
        var results = await tmdb.GetTrendingMoviesAsync();
        return Ok(results.Select(ToSearchResult).ToList());
    }

    [HttpGet("recommended")]
    public async Task<ActionResult<List<MovieSearchResult>>> GetRecommended()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var userId = int.TryParse(userIdClaim, out var id) ? id : (int?)null;

        var genreTags = new List<string>();
        if (userId is not null)
        {
            genreTags = await db.Logs
                .Where(l => l.UserId == userId && l.Movie.Genres != null)
                .Select(l => l.Movie.Genres!)
                .ToListAsync();
        }

        var favoriteGenreName = genreTags
            .SelectMany(g => g.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
            .GroupBy(g => g, StringComparer.OrdinalIgnoreCase)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .FirstOrDefault();

        var favoriteGenreId = favoriteGenreName is null
            ? (int?)null
            : GenreNames.FirstOrDefault(kv => string.Equals(kv.Value, favoriteGenreName, StringComparison.OrdinalIgnoreCase)).Key;

        var results = favoriteGenreId is not null
            ? await tmdb.DiscoverByGenreAsync(favoriteGenreId.Value)
            : await tmdb.GetPopularMoviesAsync();

        return Ok(results.Select(ToSearchResult).ToList());
    }

    private MovieSearchResult ToSearchResult(TmdbMovieResult r) => new(
        r.Id,
        r.Title,
        tmdb.BuildPosterUrl(r.PosterPath),
        r.ReleaseDate,
        r.GenreIds
            .Where(GenreNames.ContainsKey)
            .Select(id => GenreNames[id])
            .Take(1)
            .ToArray(),
        r.Overview
    );

    [HttpGet("{tmdbId:int}")]
    public async Task<ActionResult<MovieResponse>> GetByTmdbId(int tmdbId)
    {
        var movie = await movieCache.GetOrCacheMovieAsync(tmdbId);
        if (movie is null)
            return NotFound(new { message = "Movie not found on TMDB." });

        var detail = await tmdb.GetMovieDetailAsync(tmdbId);
        var genres = detail?.Genres?.Take(3).Select(g => g.Name).ToList() ?? [];

        var credits = await tmdb.GetCreditsAsync(tmdbId);
        var director = credits?.Crew?.FirstOrDefault(c => c.Job == "Director")?.Name;
        var cast = credits?.Cast?.OrderBy(c => c.Order).Take(5).Select(c => c.Name).ToList() ?? [];

        var providers = await tmdb.GetWatchProvidersAsync(tmdbId);

        var watchProviders =
            providers?.Results?
                .FirstOrDefault().Value?
                .Flatrate?
                .Select(p => p.ProviderName)
                .ToList()
            ?? [];

        var loggedRatings = await db.Logs
            .Where(l => l.MovieId == movie.MovieId && l.Rating != null)
            .Select(l => l.Rating!.Value)
            .ToListAsync();
        var appRating = loggedRatings.Count > 0 ? Math.Round(loggedRatings.Average(), 1) : 0;

        return Ok(new MovieResponse(
            movie.MovieId,
            movie.TmdbId,
            movie.Title,
            tmdb.BuildPosterUrl(movie.PosterPath),
            movie.ReleaseDate,
            movie.RuntimeMinutes,
            detail?.Overview,
            genres,
            appRating,
            director,
            cast, 
            watchProviders
        ));
    }

    [HttpGet("{tmdbId:int}/reviews")]
    public async Task<ActionResult<List<MovieReviewResponse>>> GetReviews(int tmdbId)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var currentUserId = int.TryParse(userIdClaim, out var id) ? id : (int?)null;

        var reviews = await db.Logs
            .Include(l => l.User)
            .Where(l => l.Movie.TmdbId == tmdbId
                        && l.Review != null && l.Review != ""
                        && l.UserId != currentUserId)
            .OrderByDescending(l => l.WatchedDate)
            .ThenByDescending(l => l.CreatedAt)
            .Take(20)
            .Select(l => new MovieReviewResponse(
                l.User.Username,
                l.User.DisplayName,
                l.Rating,
                l.Review!,
                l.WatchedDate
            ))
            .ToListAsync();

        return Ok(reviews);
    }
}
