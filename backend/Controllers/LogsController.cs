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
[Route("api/logs")]
[Authorize]
public class LogsController(CinephileDbContext db, ITmdbService tmdb, IMovieCacheService movieCache, IGamificationService gamification) : ControllerBase
{
    private int? GetUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(claim, out var id) ? id : null;
    }

    private LogResponse ToResponse(Log log) => new(
        log.LogId,
        log.Movie.MovieId,
        log.Movie.TmdbId,
        log.Movie.Title,
        tmdb.BuildPosterUrl(log.Movie.PosterPath),
        log.WatchedDate,
        log.Rating,
        log.Review,
        log.CreatedAt
    );

    [HttpGet]
    public async Task<ActionResult<List<LogResponse>>> GetLogs()
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var logs = await db.Logs
            .Where(l => l.UserId == userId)
            .Include(l => l.Movie)
            .OrderByDescending(l => l.WatchedDate)
            .ThenByDescending(l => l.CreatedAt)
            .ToListAsync();

        return Ok(logs.Select(ToResponse).ToList());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<LogResponse>> GetLog(int id)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var log = await db.Logs.Include(l => l.Movie).FirstOrDefaultAsync(l => l.LogId == id);
        if (log is null || log.UserId != userId)
            return NotFound(new { message = "Log not found." });

        return Ok(ToResponse(log));
    }

    [HttpPost]
    public async Task<ActionResult<LogCreatedResponse>> CreateLog(CreateLogRequest request)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var movie = await movieCache.GetOrCacheMovieAsync(request.TmdbId);
        if (movie is null)
            return NotFound(new { message = "Movie not found on TMDB." });

        var existingLog = await db.Logs
        .FirstOrDefaultAsync(l =>
            l.UserId == userId.Value &&
            l.MovieId == movie.MovieId);

        if (existingLog is not null)
        {
            return Conflict(new
            {
                message = "You have already logged this movie."
            });
        }

        var hasReview = !string.IsNullOrWhiteSpace(request.Review);

        var log = new Log
        {
            UserId = userId.Value,
            MovieId = movie.MovieId,
            WatchedDate = request.WatchedDate,
            Rating = request.Rating,
            Review = string.IsNullOrWhiteSpace(request.Review)
            ? null
            : request.Review.Trim(),
            PointsEarned = gamification.CalculateLogPoints(hasReview)
        };
        db.Logs.Add(log);

        var watchlistEntry = await db.WatchlistEntries
            .FirstOrDefaultAsync(w => w.UserId == userId && w.MovieId == movie.MovieId);
        
        if (watchlistEntry is not null)
            db.WatchlistEntries.Remove(watchlistEntry);

        await db.SaveChangesAsync();

        var result = await gamification.ApplyLogGamificationAsync(userId.Value, log);

        log.Movie = movie;

        var feedback = new GamificationFeedback(
            result.PointsAwarded,
            result.LeveledUp,
            result.NewLevelName,
            result.UnlockedAchievements
                .Select(a => new AchievementUnlockDto(a.Code, a.Name, a.Details, a.Points))
                .ToList()
        );

        return CreatedAtAction(
            nameof(GetLog),
            new { id = log.LogId },
            new LogCreatedResponse(ToResponse(log), feedback)
        );
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<LogResponse>> UpdateLog(int id, UpdateLogRequest request)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var log = await db.Logs.Include(l => l.Movie).FirstOrDefaultAsync(l => l.LogId == id);
        if (log is null || log.UserId != userId)
            return NotFound(new { message = "Log not found." });

        log.WatchedDate = request.WatchedDate;
        log.Rating = request.Rating;
        log.Review = string.IsNullOrWhiteSpace(request.Review)
            ? null
            : request.Review.Trim();

        await db.SaveChangesAsync();
        return Ok(ToResponse(log));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteLog(int id)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var log = await db.Logs.FirstOrDefaultAsync(l => l.LogId == id);
        if (log is null || log.UserId != userId)
            return NotFound(new { message = "Log not found." });

        var pointsToRevert = log.PointsEarned;

        db.Logs.Remove(log);
        await db.SaveChangesAsync();

        await gamification.RevertLogPointsAsync(userId.Value, pointsToRevert);

        return NoContent();
    }
}
