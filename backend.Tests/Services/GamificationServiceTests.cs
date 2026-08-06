using backend.Models;
using backend.Services;
using backend.Tests.Helpers;
using Microsoft.EntityFrameworkCore;

namespace backend.Tests.Services;

public class GamificationServiceTests
{
    [Theory]
    [InlineData(false, 10)]
    [InlineData(true, 15)]
    public void CalculateLogPoints_ReturnsBasePointsAndReviewBonus(bool hasReview, int expected)
    {
        using var db = TestDb.Create();
        var service = new GamificationService(db);
        Assert.Equal(expected, service.CalculateLogPoints(hasReview));
    }

    [Fact]
    public async Task ApplyLogGamification_AwardsLogPointsAndFirstLogAchievementOnlyOnce()
    {
        await using var db = TestDb.Create();
        var user = await TestDb.AddUserAsync(db);
        var movie1 = await TestDb.AddMovieAsync(db, 1, "First");
        var firstLog = new Log { UserId = user.UserId, MovieId = movie1.MovieId, WatchedDate = new DateOnly(2026, 1, 1), PointsEarned = 10 };
        db.Logs.Add(firstLog);
        await db.SaveChangesAsync();
        var service = new GamificationService(db);

        var first = await service.ApplyLogGamificationAsync(user.UserId, firstLog);

        Assert.Equal(20, first.PointsAwarded);
        Assert.Contains(first.UnlockedAchievements, a => a.Code == "FIRST_LOG");
        Assert.Equal(20, (await db.Users.FindAsync(user.UserId))!.Points);

        var movie2 = await TestDb.AddMovieAsync(db, 2, "Second");
        var secondLog = new Log { UserId = user.UserId, MovieId = movie2.MovieId, WatchedDate = new DateOnly(2026, 1, 2), PointsEarned = 10 };
        db.Logs.Add(secondLog);
        await db.SaveChangesAsync();
        var second = await service.ApplyLogGamificationAsync(user.UserId, secondLog);

        Assert.Equal(10, second.PointsAwarded);
        Assert.DoesNotContain(second.UnlockedAchievements, a => a.Code == "FIRST_LOG");
        Assert.Equal(1, await db.UserAchievements.CountAsync());
    }

    [Fact]
    public async Task ApplyLogGamification_LevelsUserUpWhenThresholdIsReached()
    {
        await using var db = TestDb.Create();
        var user = await TestDb.AddUserAsync(db, points: 45);
        var movie = await TestDb.AddMovieAsync(db);
        var log = new Log { UserId = user.UserId, MovieId = movie.MovieId, WatchedDate = new DateOnly(2026, 1, 1), PointsEarned = 10 };
        db.Logs.Add(log);
        await db.SaveChangesAsync();
        var service = new GamificationService(db);

        var result = await service.ApplyLogGamificationAsync(user.UserId, log);

        Assert.True(result.LeveledUp);
        Assert.Equal("Popcorn Enthusiast", result.NewLevelName);
        Assert.Equal(2, (await db.Users.FindAsync(user.UserId))!.LevelId);
    }

    [Fact]
    public async Task ApplyLogGamification_UnlocksCriticAtTenReviews()
    {
        await using var db = TestDb.Create();
        var user = await TestDb.AddUserAsync(db);
        for (var i = 1; i <= 10; i++)
        {
            var movie = await TestDb.AddMovieAsync(db, 100 + i, $"Movie {i}");
            db.Logs.Add(new Log
            {
                UserId = user.UserId,
                MovieId = movie.MovieId,
                WatchedDate = new DateOnly(2026, 1, i),
                Review = "Review",
                PointsEarned = 15
            });
        }
        await db.SaveChangesAsync();
        var lastLog = await db.Logs.OrderBy(l => l.LogId).LastAsync();
        var service = new GamificationService(db);

        var result = await service.ApplyLogGamificationAsync(user.UserId, lastLog);

        Assert.Contains(result.UnlockedAchievements, a => a.Code == "CRITIC_10");
    }

    [Fact]
    public async Task ApplyLogGamification_UnlocksMarathonerForFiveLogsInOneCalendarWeek()
    {
        await using var db = TestDb.Create();
        var user = await TestDb.AddUserAsync(db);
        for (var i = 0; i < 5; i++)
        {
            var movie = await TestDb.AddMovieAsync(db, 200 + i, $"Movie {i}");
            db.Logs.Add(new Log { UserId = user.UserId, MovieId = movie.MovieId, WatchedDate = new DateOnly(2026, 1, 5).AddDays(i), PointsEarned = 10 });
        }
        await db.SaveChangesAsync();
        var last = await db.Logs.OrderBy(l => l.LogId).LastAsync();
        var service = new GamificationService(db);

        var result = await service.ApplyLogGamificationAsync(user.UserId, last);

        Assert.Contains(result.UnlockedAchievements, a => a.Code == "MARATHONER");
    }

    [Fact]
    public async Task ApplyLogGamification_UnlocksExplorerForEightDistinctGenres()
    {
        await using var db = TestDb.Create();
        var user = await TestDb.AddUserAsync(db);
        var genres = new[] { "Drama", "Comedy", "Action", "Crime", "Horror", "Romance", "Fantasy", "History" };
        for (var i = 0; i < genres.Length; i++)
        {
            var movie = await TestDb.AddMovieAsync(db, 300 + i, $"Movie {i}", genres[i]);
            db.Logs.Add(new Log { UserId = user.UserId, MovieId = movie.MovieId, WatchedDate = new DateOnly(2026, 2, 1).AddDays(i), PointsEarned = 10 });
        }
        await db.SaveChangesAsync();
        var last = await db.Logs.OrderBy(l => l.LogId).LastAsync();
        var service = new GamificationService(db);

        var result = await service.ApplyLogGamificationAsync(user.UserId, last);

        Assert.Contains(result.UnlockedAchievements, a => a.Code == "EXPLORER_8");
        Assert.Equal(8, await service.GetDistinctGenreCountAsync(user.UserId));
    }

    [Fact]
    public async Task CheckWatchlistAchievements_UnlocksProcrastinatorAtTwentyMovies()
    {
        await using var db = TestDb.Create();
        var user = await TestDb.AddUserAsync(db);
        for (var i = 0; i < 20; i++)
        {
            var movie = await TestDb.AddMovieAsync(db, 400 + i, $"Movie {i}");
            db.WatchlistEntries.Add(new Watchlist { UserId = user.UserId, MovieId = movie.MovieId });
        }
        await db.SaveChangesAsync();
        var service = new GamificationService(db);

        var result = await service.CheckWatchlistAchievementsAsync(user.UserId);

        Assert.Equal(20, result.PointsAwarded);
        Assert.Contains(result.UnlockedAchievements, a => a.Code == "PROCRASTINATOR_20");
    }

    [Fact]
    public async Task GetCurrentStreak_CountsDistinctConsecutiveDaysEndingTodayOrYesterday()
    {
        await using var db = TestDb.Create();
        var user = await TestDb.AddUserAsync(db);
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        for (var i = 0; i < 3; i++)
        {
            var movie = await TestDb.AddMovieAsync(db, 500 + i, $"Movie {i}");
            db.Logs.Add(new Log { UserId = user.UserId, MovieId = movie.MovieId, WatchedDate = today.AddDays(-i) });
        }
        var duplicateMovie = await TestDb.AddMovieAsync(db, 599, "Duplicate day");
        db.Logs.Add(new Log { UserId = user.UserId, MovieId = duplicateMovie.MovieId, WatchedDate = today });
        await db.SaveChangesAsync();
        var service = new GamificationService(db);

        var streak = await service.GetCurrentStreakAsync(user.UserId);

        Assert.Equal(3, streak);
    }

    [Fact]
    public async Task GetCurrentStreak_ReturnsZeroWhenLatestLogIsOlderThanYesterday()
    {
        await using var db = TestDb.Create();
        var user = await TestDb.AddUserAsync(db);
        var movie = await TestDb.AddMovieAsync(db);
        db.Logs.Add(new Log { UserId = user.UserId, MovieId = movie.MovieId, WatchedDate = DateOnly.FromDateTime(DateTime.UtcNow).AddDays(-2) });
        await db.SaveChangesAsync();
        var service = new GamificationService(db);

        Assert.Equal(0, await service.GetCurrentStreakAsync(user.UserId));
    }

    [Fact]
    public async Task GetLongestStreak_ReturnsLongestRunNotJustMostRecentRun()
    {
        await using var db = TestDb.Create();
        var user = await TestDb.AddUserAsync(db);
        var dates = new[]
        {
            new DateOnly(2025, 1, 1), new DateOnly(2025, 1, 2), new DateOnly(2025, 1, 3),
            new DateOnly(2025, 3, 1), new DateOnly(2025, 3, 2)
        };
        for (var i = 0; i < dates.Length; i++)
        {
            var movie = await TestDb.AddMovieAsync(db, 600 + i, $"Movie {i}");
            db.Logs.Add(new Log { UserId = user.UserId, MovieId = movie.MovieId, WatchedDate = dates[i] });
        }
        await db.SaveChangesAsync();
        var service = new GamificationService(db);

        Assert.Equal(3, await service.GetLongestStreakAsync(user.UserId));
    }

    [Fact]
    public async Task RevertLogPoints_SubtractsPointsWithoutGoingBelowZero()
    {
        await using var db = TestDb.Create();
        var user = await TestDb.AddUserAsync(db, points: 8);
        var service = new GamificationService(db);

        await service.RevertLogPointsAsync(user.UserId, 15);

        Assert.Equal(0, (await db.Users.FindAsync(user.UserId))!.Points);
    }
}
