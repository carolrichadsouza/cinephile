using backend.Controllers;
using backend.DTOs;
using backend.Models;
using backend.Services;
using backend.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace backend.Tests.Controllers;

public class LogsControllerTests
{
    private static Mock<ITmdbService> TmdbMock()
    {
        var mock = new Mock<ITmdbService>();
        mock.Setup(x => x.BuildPosterUrl(It.IsAny<string?>()))
            .Returns((string? path) => path is null ? null : $"https://image.test{path}");
        return mock;
    }

    [Fact]
    public async Task GetLogs_ReturnsOnlyCurrentUsersLogsInDescendingDateOrder()
    {
        await using var db = TestDb.Create();
        var current = await TestDb.AddUserAsync(db);
        var other = await TestDb.AddUserAsync(db, "other", "other@example.com");
        var movie1 = await TestDb.AddMovieAsync(db, 1, "Older");
        var movie2 = await TestDb.AddMovieAsync(db, 2, "Newer");
        db.Logs.AddRange(
            new Log { UserId = current.UserId, MovieId = movie1.MovieId, WatchedDate = new DateOnly(2026, 1, 1) },
            new Log { UserId = current.UserId, MovieId = movie2.MovieId, WatchedDate = new DateOnly(2026, 2, 1) },
            new Log { UserId = other.UserId, MovieId = movie2.MovieId, WatchedDate = new DateOnly(2026, 3, 1) });
        await db.SaveChangesAsync();
        var controller = new LogsController(db, TmdbMock().Object, Mock.Of<IMovieCacheService>(), Mock.Of<IGamificationService>()).AsUser(current.UserId);

        var result = await controller.GetLogs();

        var logs = result.ValueFromOk();
        Assert.Equal(2, logs.Count);
        Assert.Equal("Newer", logs[0].Title);
        Assert.All(logs, l => Assert.NotEqual(other.UserId, current.UserId));
    }

    [Fact]
    public async Task GetLog_ReturnsNotFoundForAnotherUsersLog()
    {
        await using var db = TestDb.Create();
        var current = await TestDb.AddUserAsync(db);
        var other = await TestDb.AddUserAsync(db, "other", "other@example.com");
        var movie = await TestDb.AddMovieAsync(db);
        var log = new Log { UserId = other.UserId, MovieId = movie.MovieId, WatchedDate = DateOnly.FromDateTime(DateTime.UtcNow) };
        db.Logs.Add(log);
        await db.SaveChangesAsync();
        var controller = new LogsController(db, TmdbMock().Object, Mock.Of<IMovieCacheService>(), Mock.Of<IGamificationService>()).AsUser(current.UserId);

        var result = await controller.GetLog(log.LogId);

        Assert.IsType<NotFoundObjectResult>(result.Result);
    }

    [Fact]
    public async Task CreateLog_CreatesTrimmedLogRemovesWatchlistAndReturnsGamification()
    {
        await using var db = TestDb.Create();
        var user = await TestDb.AddUserAsync(db);
        var movie = await TestDb.AddMovieAsync(db);
        db.WatchlistEntries.Add(new Watchlist { UserId = user.UserId, MovieId = movie.MovieId });
        await db.SaveChangesAsync();

        var cache = new Mock<IMovieCacheService>();
        cache.Setup(x => x.GetOrCacheMovieAsync(movie.TmdbId)).ReturnsAsync(movie);
        var gamification = new Mock<IGamificationService>();
        gamification.Setup(x => x.CalculateLogPoints(true)).Returns(15);
        gamification.Setup(x => x.ApplyLogGamificationAsync(user.UserId, It.IsAny<Log>()))
            .ReturnsAsync(new GamificationResult(25, true, "Popcorn Enthusiast", [new AchievementUnlock("FIRST_LOG", "First Reel", null, 10)]));
        var controller = new LogsController(db, TmdbMock().Object, cache.Object, gamification.Object).AsUser(user.UserId);

        var result = await controller.CreateLog(new CreateLogRequest(movie.TmdbId, new DateOnly(2026, 8, 1), 4.5, "  Great movie  "));

        var response = result.ValueFromCreated();
        var saved = await db.Logs.SingleAsync();
        Assert.Equal("Great movie", saved.Review);
        Assert.Equal(15, saved.PointsEarned);
        Assert.Empty(db.WatchlistEntries);
        Assert.Equal(25, response.Gamification.PointsAwarded);
        Assert.True(response.Gamification.LeveledUp);
        Assert.Single(response.Gamification.UnlockedAchievements);
    }

    [Fact]
    public async Task CreateLog_ReturnsConflictWhenMovieAlreadyLogged()
    {
        await using var db = TestDb.Create();
        var user = await TestDb.AddUserAsync(db);
        var movie = await TestDb.AddMovieAsync(db);
        db.Logs.Add(new Log { UserId = user.UserId, MovieId = movie.MovieId, WatchedDate = new DateOnly(2026, 1, 1) });
        await db.SaveChangesAsync();
        var cache = new Mock<IMovieCacheService>();
        cache.Setup(x => x.GetOrCacheMovieAsync(movie.TmdbId)).ReturnsAsync(movie);
        var controller = new LogsController(db, TmdbMock().Object, cache.Object, Mock.Of<IGamificationService>()).AsUser(user.UserId);

        var result = await controller.CreateLog(new CreateLogRequest(movie.TmdbId, new DateOnly(2026, 2, 1), null, null));

        Assert.IsType<ConflictObjectResult>(result.Result);
        Assert.Equal(1, await db.Logs.CountAsync());
    }

    [Fact]
    public async Task CreateLog_ReturnsNotFoundWhenMovieDoesNotExistOnTmdb()
    {
        await using var db = TestDb.Create();
        var user = await TestDb.AddUserAsync(db);
        var cache = new Mock<IMovieCacheService>();
        cache.Setup(x => x.GetOrCacheMovieAsync(999)).ReturnsAsync((Movie?)null);
        var controller = new LogsController(db, TmdbMock().Object, cache.Object, Mock.Of<IGamificationService>()).AsUser(user.UserId);

        var result = await controller.CreateLog(new CreateLogRequest(999, new DateOnly(2026, 1, 1), null, null));

        Assert.IsType<NotFoundObjectResult>(result.Result);
    }

    [Fact]
    public async Task UpdateLog_UpdatesOwnedLogAndTrimsReview()
    {
        await using var db = TestDb.Create();
        var user = await TestDb.AddUserAsync(db);
        var movie = await TestDb.AddMovieAsync(db);
        var log = new Log { UserId = user.UserId, MovieId = movie.MovieId, WatchedDate = new DateOnly(2026, 1, 1), Review = "old" };
        db.Logs.Add(log);
        await db.SaveChangesAsync();
        var controller = new LogsController(db, TmdbMock().Object, Mock.Of<IMovieCacheService>(), Mock.Of<IGamificationService>()).AsUser(user.UserId);

        var result = await controller.UpdateLog(log.LogId, new UpdateLogRequest(new DateOnly(2026, 2, 2), 5, "  updated  "));

        var response = result.ValueFromOk();
        Assert.Equal(new DateOnly(2026, 2, 2), response.WatchedDate);
        Assert.Equal(5, response.Rating);
        Assert.Equal("updated", response.Review);
    }

    [Fact]
    public async Task UpdateLog_ReturnsNotFoundForAnotherUsersLog()
    {
        await using var db = TestDb.Create();
        var owner = await TestDb.AddUserAsync(db);
        var other = await TestDb.AddUserAsync(db, "other", "other@example.com");
        var movie = await TestDb.AddMovieAsync(db);
        var log = new Log { UserId = owner.UserId, MovieId = movie.MovieId, WatchedDate = new DateOnly(2026, 1, 1) };
        db.Logs.Add(log);
        await db.SaveChangesAsync();
        var controller = new LogsController(db, TmdbMock().Object, Mock.Of<IMovieCacheService>(), Mock.Of<IGamificationService>()).AsUser(other.UserId);

        var result = await controller.UpdateLog(log.LogId, new UpdateLogRequest(new DateOnly(2026, 2, 2), 4, "attempt"));

        Assert.IsType<NotFoundObjectResult>(result.Result);
        Assert.Equal(new DateOnly(2026, 1, 1), (await db.Logs.FindAsync(log.LogId))!.WatchedDate);
    }

    [Fact]
    public async Task DeleteLog_RemovesOwnedLogAndRevertsItsPoints()
    {
        await using var db = TestDb.Create();
        var user = await TestDb.AddUserAsync(db);
        var movie = await TestDb.AddMovieAsync(db);
        var log = new Log { UserId = user.UserId, MovieId = movie.MovieId, WatchedDate = new DateOnly(2026, 1, 1), PointsEarned = 15 };
        db.Logs.Add(log);
        await db.SaveChangesAsync();
        var gamification = new Mock<IGamificationService>();
        var controller = new LogsController(db, TmdbMock().Object, Mock.Of<IMovieCacheService>(), gamification.Object).AsUser(user.UserId);

        var result = await controller.DeleteLog(log.LogId);

        Assert.IsType<NoContentResult>(result);
        Assert.Empty(db.Logs);
        gamification.Verify(x => x.RevertLogPointsAsync(user.UserId, 15), Times.Once);
    }

    [Fact]
    public async Task ProtectedAction_ReturnsUnauthorizedWhenUserClaimIsMissing()
    {
        await using var db = TestDb.Create();
        var controller = new LogsController(db, TmdbMock().Object, Mock.Of<IMovieCacheService>(), Mock.Of<IGamificationService>()).WithoutUser();

        var result = await controller.GetLogs();

        Assert.IsType<UnauthorizedResult>(result.Result);
    }
}
