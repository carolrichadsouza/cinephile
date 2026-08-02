using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/movies")]
[Authorize]
public class MoviesController(ITmdbService tmdb, IMovieCacheService movieCache) : ControllerBase
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

        return Ok(results.Select(r => new MovieSearchResult(
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
        )).ToList());
    }

    [HttpGet("{tmdbId:int}")]
    public async Task<ActionResult<MovieResponse>> GetByTmdbId(int tmdbId)
    {
        var movie = await movieCache.GetOrCacheMovieAsync(tmdbId);
        if (movie is null)
            return NotFound(new { message = "Movie not found on TMDB." });

        return Ok(new MovieResponse(
            movie.MovieId,
            movie.TmdbId,
            movie.Title,
            tmdb.BuildPosterUrl(movie.PosterPath),
            movie.ReleaseDate,
            movie.RuntimeMinutes,
            null
        ));
    }
}
