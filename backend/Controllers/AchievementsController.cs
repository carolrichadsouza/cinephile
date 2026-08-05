using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/achievements")]
[Authorize]
public class AchievementsController(CinephileDbContext db, IGamificationService gamification) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<AchievementResponse>>> GetAchievements()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdClaim is null || !int.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var achievements = await db.Achievements.OrderBy(a => a.AchievementId).ToListAsync();
        var earned = await db.UserAchievements
            .Where(ua => ua.UserId == userId)
            .ToDictionaryAsync(ua => ua.AchievementId, ua => ua.DateAchieved);

        var logCount = await db.Logs.CountAsync(l => l.UserId == userId);
        var reviewCount = await db.Logs.CountAsync(l => l.UserId == userId && l.Review != null && l.Review != "");
        var watchlistCount = await db.WatchlistEntries.CountAsync(w => w.UserId == userId);
        var distinctGenres = await gamification.GetDistinctGenreCountAsync(userId);
        var longestStreak = await gamification.GetLongestStreakAsync(userId);
        var user = await db.Users.FirstOrDefaultAsync(u => u.UserId == userId);
        var currentLevelId = user?.LevelId ?? 1;

        (int current, int target) Progress(string code) => code switch
        {
            "FIRST_LOG" => (Math.Min(logCount, 1), 1),
            "MARATHONER" => (0, 1),
            "CENTURION" => (Math.Min(logCount, 100), 100),
            "CRITIC_10" => (Math.Min(reviewCount, 10), 10),
            "EXPLORER_8" => (Math.Min(distinctGenres, 8), 8),
            "DEVOTED_30" => (Math.Min(longestStreak, 30), 30),
            "PROCRASTINATOR_20" => (Math.Min(watchlistCount, 20), 20),
            "TRUE_CINEPHILE_LVL20" => (Math.Min(currentLevelId, 20), 20),
            _ => (0, 1)
        };

        var response = achievements.Select(a =>
        {
            var isEarned = earned.ContainsKey(a.AchievementId);
            var (current, target) = Progress(a.Code);
            return new AchievementResponse(
                a.Code,
                a.Name,
                a.Details,
                a.Points,
                isEarned,
                isEarned ? earned[a.AchievementId] : null,
                isEarned ? target : current,
                target
            );
        }).ToList();

        return Ok(response);
    }
}
