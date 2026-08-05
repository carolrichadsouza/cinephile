using System.Globalization;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Services;

public record AchievementUnlock(string Code, string Name, string? Details, int Points);

public record GamificationResult(
    int PointsAwarded,
    bool LeveledUp,
    string? NewLevelName,
    List<AchievementUnlock> UnlockedAchievements
);

public interface IGamificationService
{
    /// <summary>Base points for logging a movie, plus a bonus if a review is included. Pure - no DB access.</summary>
    int CalculateLogPoints(bool hasReview);

    /// <summary>Call after a Log is saved: applies its PointsEarned to the user, handles level-ups, and checks log-related achievements. Returns what actually happened, for UI feedback (toasts etc).</summary>
    Task<GamificationResult> ApplyLogGamificationAsync(int userId, Log log);

    /// <summary>Call after a Log is deleted: reverses the points it had awarded. Does not revoke achievements or levels already earned.</summary>
    Task RevertLogPointsAsync(int userId, int pointsToRevert);

    /// <summary>Call after adding a movie to the watchlist: checks the watchlist-size achievement.</summary>
    Task<GamificationResult> CheckWatchlistAchievementsAsync(int userId);

    /// <summary>The user's currently active streak (consecutive days up to today/yesterday) - distinct from the all-time longest streak used for the Devoted achievement.</summary>
    Task<int> GetCurrentStreakAsync(int userId);

    /// <summary>All-time longest run of consecutive days with a log - used for the Devoted achievement and its progress bar.</summary>
    Task<int> GetLongestStreakAsync(int userId);

    /// <summary>Count of distinct genres across all of a user's logged movies - used for the Explorer achievement and its progress bar.</summary>
    Task<int> GetDistinctGenreCountAsync(int userId);
}

public class GamificationService(CinephileDbContext db) : IGamificationService
{
    private const int LogBasePoints = 10;
    private const int ReviewBonusPoints = 5;

    private const string FirstLogCode = "FIRST_LOG";
    private const string MarathonerCode = "MARATHONER";
    private const string CenturionCode = "CENTURION";
    private const string CriticCode = "CRITIC_10";
    private const string ExplorerCode = "EXPLORER_8";
    private const string DevotedCode = "DEVOTED_30";
    private const string ProcrastinatorCode = "PROCRASTINATOR_20";
    private const string TrueCinephileCode = "TRUE_CINEPHILE_LVL20";

    public int CalculateLogPoints(bool hasReview) => LogBasePoints + (hasReview ? ReviewBonusPoints : 0);

    public async Task<GamificationResult> ApplyLogGamificationAsync(int userId, Log log)
    {
        var user = await db.Users.Include(u => u.Level).FirstOrDefaultAsync(u => u.UserId == userId);
        if (user is null) return new GamificationResult(0, false, null, []);

        var startingLevelId = user.LevelId;
        var unlocked = new List<AchievementUnlock>();

        await AwardPointsAsync(user, log.PointsEarned, unlocked);

        var logCount = await db.Logs.CountAsync(l => l.UserId == userId);
        var reviewCount = await db.Logs.CountAsync(l => l.UserId == userId && l.Review != null && l.Review != "");

        await TryAwardAchievementAsync(user, FirstLogCode, logCount >= 1, unlocked);
        await TryAwardAchievementAsync(user, CenturionCode, logCount >= 100, unlocked);
        await TryAwardAchievementAsync(user, CriticCode, reviewCount >= 10, unlocked);

        if (await HasLoggedFiveInAnyCalendarWeekAsync(userId))
            await TryAwardAchievementAsync(user, MarathonerCode, true, unlocked);

        if (await CountDistinctGenresAsync(userId) >= 8)
            await TryAwardAchievementAsync(user, ExplorerCode, true, unlocked);

        if (await ComputeLongestStreakAsync(userId) >= 30)
            await TryAwardAchievementAsync(user, DevotedCode, true, unlocked);

        await db.SaveChangesAsync();

        var totalPoints = log.PointsEarned + unlocked.Sum(a => a.Points);
        return new GamificationResult(totalPoints, user.LevelId != startingLevelId, user.Level.LevelName, unlocked);
    }

    public async Task RevertLogPointsAsync(int userId, int pointsToRevert)
    {
        if (pointsToRevert <= 0) return;

        var user = await db.Users.FirstOrDefaultAsync(u => u.UserId == userId);
        if (user is null) return;

        user.Points = Math.Max(0, user.Points - pointsToRevert);
        await db.SaveChangesAsync();
    }

    public async Task<GamificationResult> CheckWatchlistAchievementsAsync(int userId)
    {
        var user = await db.Users.Include(u => u.Level).FirstOrDefaultAsync(u => u.UserId == userId);
        if (user is null) return new GamificationResult(0, false, null, []);

        var startingLevelId = user.LevelId;
        var unlocked = new List<AchievementUnlock>();

        var watchlistCount = await db.WatchlistEntries.CountAsync(w => w.UserId == userId);
        await TryAwardAchievementAsync(user, ProcrastinatorCode, watchlistCount >= 20, unlocked);

        await db.SaveChangesAsync();

        var totalPoints = unlocked.Sum(a => a.Points);
        return new GamificationResult(totalPoints, user.LevelId != startingLevelId, user.Level.LevelName, unlocked);
    }

    public async Task<int> GetCurrentStreakAsync(int userId)
    {
        var dates = await db.Logs
            .Where(l => l.UserId == userId)
            .Select(l => l.WatchedDate)
            .Distinct()
            .OrderByDescending(d => d)
            .ToListAsync();

        if (dates.Count == 0) return 0;

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        if (dates[0] != today && dates[0] != today.AddDays(-1)) return 0;

        var streak = 1;
        for (var i = 1; i < dates.Count; i++)
        {
            if (dates[i - 1].DayNumber - dates[i].DayNumber == 1)
                streak++;
            else
                break;
        }
        return streak;
    }

    public Task<int> GetLongestStreakAsync(int userId) => ComputeLongestStreakAsync(userId);

    public Task<int> GetDistinctGenreCountAsync(int userId) => CountDistinctGenresAsync(userId);

    // --- Internals ---

    private async Task AwardPointsAsync(User user, int points, List<AchievementUnlock> unlocked)
    {
        if (points <= 0) return;

        user.Points += points;

        while (true)
        {
            var nextLevel = await db.Levels
                .Where(l => l.PointsRequired <= user.Points && l.PointsRequired > user.Level.PointsRequired)
                .OrderByDescending(l => l.PointsRequired)
                .FirstOrDefaultAsync();

            if (nextLevel is null) break;

            user.LevelId = nextLevel.LevelId;
            user.Level = nextLevel;

            if (nextLevel.LevelId == 20)
                await TryAwardAchievementAsync(user, TrueCinephileCode, true, unlocked);
        }
    }

    private async Task TryAwardAchievementAsync(User user, string code, bool qualifies, List<AchievementUnlock> unlocked)
    {
        if (!qualifies) return;

        var alreadyEarned = await db.UserAchievements.AnyAsync(ua => ua.UserId == user.UserId && ua.Achievement.Code == code);
        if (alreadyEarned) return;

        var achievement = await db.Achievements.FirstOrDefaultAsync(a => a.Code == code);
        if (achievement is null) return;

        db.UserAchievements.Add(new UserAchievement
        {
            UserId = user.UserId,
            AchievementId = achievement.AchievementId,
            PointsAwarded = achievement.Points
        });

        unlocked.Add(new AchievementUnlock(achievement.Code, achievement.Name, achievement.Details, achievement.Points));

        await AwardPointsAsync(user, achievement.Points, unlocked);
    }

    private async Task<bool> HasLoggedFiveInAnyCalendarWeekAsync(int userId)
    {
        var watchedDates = await db.Logs
            .Where(l => l.UserId == userId)
            .Select(l => l.WatchedDate)
            .ToListAsync();

        return watchedDates
            .GroupBy(d => (d.Year, Week: ISOWeek.GetWeekOfYear(d.ToDateTime(TimeOnly.MinValue))))
            .Any(g => g.Count() >= 5);
    }

    private async Task<int> CountDistinctGenresAsync(int userId)
    {
        var genreStrings = await db.Logs
            .Where(l => l.UserId == userId)
            .Select(l => l.Movie.Genres)
            .Where(g => g != null)
            .ToListAsync();

        return genreStrings
            .SelectMany(g => g!.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .Count();
    }

    private async Task<int> ComputeLongestStreakAsync(int userId)
    {
        var dates = await db.Logs
            .Where(l => l.UserId == userId)
            .Select(l => l.WatchedDate)
            .Distinct()
            .OrderBy(d => d)
            .ToListAsync();

        if (dates.Count == 0) return 0;

        var longest = 1;
        var current = 1;
        for (var i = 1; i < dates.Count; i++)
        {
            if (dates[i].DayNumber == dates[i - 1].DayNumber + 1)
            {
                current++;
                longest = Math.Max(longest, current);
            }
            else if (dates[i] != dates[i - 1])
            {
                current = 1;
            }
        }
        return longest;
    }
}
