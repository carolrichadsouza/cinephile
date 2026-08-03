using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/watchlist")]
[Authorize]
public class WatchlistController(CinephileDbContext db, ITmdbService tmdb, IMovieCacheService movieCache) : ControllerBase
{
    private int? GetUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(claim, out var id) ? id : null;
    }

    [HttpGet]
    public async Task<ActionResult<List<WatchlistItemResponse>>> GetWatchlist()
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var entries = await db.WatchlistEntries
            .Where(w => w.UserId == userId)
            .Include(w => w.Movie)
            .OrderByDescending(w => w.AddedAt)
            .ToListAsync();

        return Ok(entries.Select(w => new WatchlistItemResponse(
            w.WatchlistId,
            w.Movie.MovieId,
            w.Movie.TmdbId,
            w.Movie.Title,
            tmdb.BuildPosterUrl(w.Movie.PosterPath),
            w.Movie.ReleaseDate,
            w.AddedAt
        )).ToList());
    }

    [HttpPost]
    public async Task<ActionResult<WatchlistItemResponse>> AddToWatchlist(AddWatchlistRequest request)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var movie = await movieCache.GetOrCacheMovieAsync(request.TmdbId);
        if (movie is null)
            return NotFound(new { message = "Movie not found on TMDB." });

        var alreadyExists = await db.WatchlistEntries
            .AnyAsync(w => w.UserId == userId && w.MovieId == movie.MovieId);
        if (alreadyExists)
            return Conflict(new { message = "This movie is already on your watchlist." });

        var entry = new Watchlist
        {
            UserId = userId.Value,
            MovieId = movie.MovieId
        };
        db.WatchlistEntries.Add(entry);
        await db.SaveChangesAsync();

        return Ok(new WatchlistItemResponse(
            entry.WatchlistId,
            movie.MovieId,
            movie.TmdbId,
            movie.Title,
            tmdb.BuildPosterUrl(movie.PosterPath),
            movie.ReleaseDate,
            entry.AddedAt
        ));
    }

    [HttpDelete("{tmdbId:int}")]
    public async Task<IActionResult> RemoveFromWatchlist(int tmdbId)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var entry = await db.WatchlistEntries
            .Include(w => w.Movie)
            .FirstOrDefaultAsync(w => w.UserId == userId && w.Movie.TmdbId == tmdbId);

        if (entry is null)
            return NotFound(new { message = "That movie isn't on your watchlist." });

        db.WatchlistEntries.Remove(entry);
        await db.SaveChangesAsync();

        return NoContent();
    }
}
