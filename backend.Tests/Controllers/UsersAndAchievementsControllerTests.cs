using backend.Controllers;
using backend.Models;
using backend.Services;
using backend.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace backend.Tests.Controllers;

public class UsersAndAchievementsControllerTests
{
    [Fact]
    public async Task GetCurrentUser_ReturnsLevelProgressAndStreak()
    {
        await using var db = TestDb.Create();
        var user = await TestDb.AddUserAsync(db, points: 25);
        var gamification = new Mock<IGamificationService>();
        gamification.Setup(x => x.GetCurrentStreakAsync(user.UserId)).ReturnsAsync(3);
        var controller = new UsersController(db, gamification.Object).AsUser(user.UserId);

        var result = await controller.GetCurrentUser();

        var profile = result.ValueFromOk();
        Assert.Equal("Rookie Critic", profile.LevelName);
        Assert.Equal("Popcorn Enthusiast", profile.NextLevelName);
        Assert.Equal(50, profile.PointsForNextLevel);
        Assert.Equal(3, profile.CurrentStreak);
    }

    [Fact]
    public async Task GetMyStats_CalculatesCountsHoursAverageGenreAndRecentActivity()
    {
        await using var db = TestDb.Create();
        var user = await TestDb.AddUserAsync(db);
        var movie1 = await TestDb.AddMovieAsync(db, 1, "Drama One", "Drama", 120);
        var movie2 = await TestDb.AddMovieAsync(db, 2, "Mixed", "Drama,Comedy", 90);
        db.Logs.AddRange(
            new Log { UserId = user.UserId, MovieId = movie1.MovieId, WatchedDate = new DateOnly(DateTime.UtcNow.Year, 1, 1), Rating = 4, Review = "Good" },
            new Log { UserId = user.UserId, MovieId = movie2.MovieId, WatchedDate = new DateOnly(DateTime.UtcNow.Year, 1, 2), Rating = 5 });
        db.WatchlistEntries.Add(new Watchlist { UserId = user.UserId, MovieId = movie1.MovieId });
        await db.SaveChangesAsync();
        var gamification = new Mock<IGamificationService>();
        gamification.Setup(x => x.GetCurrentStreakAsync(user.UserId)).ReturnsAsync(2);
        var controller = new UsersController(db, gamification.Object).AsUser(user.UserId);

        var result = await controller.GetMyStats();

        var stats = result.ValueFromOk();
        Assert.Equal(2, stats.FilmsWatched);
        Assert.Equal(1, stats.InWatchlist);
        Assert.Equal(1, stats.ReviewsWritten);
        Assert.Equal(3.5, stats.HoursWatched);
        Assert.Equal(4.5, stats.AverageRating);
        Assert.Equal("Drama", stats.FavoriteGenre);
        Assert.Equal(2, stats.CurrentStreak);
        Assert.Contains(stats.RecentActivity, a => a.Type == "reviewed");
    }

    [Fact]
    public async Task GetAchievements_ReturnsEarnedStateAndCalculatedProgress()
    {
        await using var db = TestDb.Create();
        var user = await TestDb.AddUserAsync(db);
        var movie = await TestDb.AddMovieAsync(db, genres: "Drama,Comedy");
        db.Logs.Add(new Log { UserId = user.UserId, MovieId = movie.MovieId, WatchedDate = new DateOnly(2026, 1, 1), Review = "Review" });
        var firstLog = db.Achievements.Single(a => a.Code == "FIRST_LOG");
        db.UserAchievements.Add(new UserAchievement { UserId = user.UserId, AchievementId = firstLog.AchievementId, PointsAwarded = firstLog.Points });
        await db.SaveChangesAsync();
        var gamification = new Mock<IGamificationService>();
        gamification.Setup(x => x.GetDistinctGenreCountAsync(user.UserId)).ReturnsAsync(2);
        gamification.Setup(x => x.GetLongestStreakAsync(user.UserId)).ReturnsAsync(1);
        var controller = new AchievementsController(db, gamification.Object).AsUser(user.UserId);

        var result = await controller.GetAchievements();

        var achievements = result.ValueFromOk();
        var earned = achievements.Single(a => a.Code == "FIRST_LOG");
        var critic = achievements.Single(a => a.Code == "CRITIC_10");
        var explorer = achievements.Single(a => a.Code == "EXPLORER_8");
        Assert.True(earned.Earned);
        Assert.Equal(1, earned.CurrentProgress);
        Assert.Equal(1, critic.CurrentProgress);
        Assert.Equal(2, explorer.CurrentProgress);
        Assert.Equal(8, achievements.Count);
    }

    [Fact]
    public async Task UserAndAchievementEndpoints_ReturnUnauthorizedWithoutUserClaim()
    {
        await using var db = TestDb.Create();
        var users = new UsersController(db, Mock.Of<IGamificationService>()).WithoutUser();
        var achievements = new AchievementsController(db, Mock.Of<IGamificationService>()).WithoutUser();

        var userResult = await users.GetCurrentUser();
        var achievementResult = await achievements.GetAchievements();

        Assert.IsType<UnauthorizedResult>(userResult.Result);
        Assert.IsType<UnauthorizedResult>(achievementResult.Result);
    }
}
