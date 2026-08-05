using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController(CinephileDbContext db, IGamificationService gamification) : ControllerBase
{
    private int? GetUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(claim, out var id) ? id : null;
    }

    [HttpGet("me")]
    public async Task<ActionResult<UserProfileResponse>> GetCurrentUser()
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var user = await db.Users
            .Include(u => u.Level)
            .FirstOrDefaultAsync(u => u.UserId == userId);

        if (user is null)
            return NotFound();

        var nextLevel = await db.Levels
            .Where(l => l.PointsRequired > user.Level.PointsRequired)
            .OrderBy(l => l.PointsRequired)
            .FirstOrDefaultAsync();

        var currentStreak = await gamification.GetCurrentStreakAsync(userId.Value);

        return Ok(new UserProfileResponse(
            user.UserId,
            user.Username,
            user.Email,
            user.DisplayName,
            user.Bio,
            user.AvatarPath,
            user.Points,
            user.LevelId,
            user.Level.LevelName,
            user.Level.PointsRequired,
            nextLevel?.LevelName,
            nextLevel?.PointsRequired,
            currentStreak
        ));
    }

    [HttpGet("me/stats")]
    public async Task<ActionResult<ProfileStatsResponse>> GetMyStats()
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var logs = await db.Logs
            .Where(l => l.UserId == userId)
            .Include(l => l.Movie)
            .ToListAsync();

        var filmsWatched = logs.Count;
        var reviewsWritten = logs.Count(l => !string.IsNullOrWhiteSpace(l.Review));
        var inWatchlist = await db.WatchlistEntries.CountAsync(w => w.UserId == userId);
        var watchedThisYear = logs.Count(l => l.WatchedDate.Year == DateTime.UtcNow.Year);
        var hoursWatched = Math.Round(logs.Where(l => l.Movie.RuntimeMinutes != null).Sum(l => l.Movie.RuntimeMinutes!.Value) / 60.0, 1);

        var ratings = logs.Where(l => l.Rating != null).Select(l => l.Rating!.Value).ToList();
        double? averageRating = ratings.Count > 0 ? Math.Round(ratings.Average(), 1) : null;

        var genreTags = logs
            .Where(l => l.Movie.Genres != null)
            .SelectMany(l => l.Movie.Genres!.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
            .ToList();

        var genreBreakdown = genreTags
            .GroupBy(g => g, StringComparer.OrdinalIgnoreCase)
            .Select(g => new { Genre = g.Key, Count = g.Count() })
            .OrderByDescending(g => g.Count)
            .Take(5)
            .Select(g => new GenreBreakdownItem(g.Genre, Math.Round(100.0 * g.Count / genreTags.Count, 1)))
            .ToList();

        var favoriteGenre = genreBreakdown.Count > 0 ? genreBreakdown[0].Genre : null;
        var currentStreak = await gamification.GetCurrentStreakAsync(userId.Value);

        var achievementUnlocks = await db.UserAchievements
            .Where(ua => ua.UserId == userId)
            .Include(ua => ua.Achievement)
            .Select(ua => new ActivityItem("achievement", $"Unlocked \"{ua.Achievement.Name}\"", ua.DateAchieved))
            .ToListAsync();

        var watchActivity = logs.Select(l => new ActivityItem(
            "watched",
            l.Rating != null ? $"Watched \"{l.Movie.Title}\" — rated {l.Rating}/5" : $"Watched \"{l.Movie.Title}\"",
            l.CreatedAt
        ));

        var reviewActivity = logs
            .Where(l => !string.IsNullOrWhiteSpace(l.Review))
            .Select(l => new ActivityItem("reviewed", $"Reviewed \"{l.Movie.Title}\"", l.CreatedAt));

        var recentActivity = achievementUnlocks
            .Concat(watchActivity)
            .Concat(reviewActivity)
            .OrderByDescending(a => a.Timestamp)
            .Take(10)
            .ToList();

        return Ok(new ProfileStatsResponse(
            filmsWatched,
            inWatchlist,
            reviewsWritten,
            hoursWatched,
            favoriteGenre,
            watchedThisYear,
            currentStreak,
            averageRating,
            genreBreakdown,
            recentActivity
        ));
    }
}
