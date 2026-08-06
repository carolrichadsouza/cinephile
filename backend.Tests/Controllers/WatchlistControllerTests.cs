using backend.Controllers;
using backend.Models;
using backend.Services;
using backend.Tests.Helpers;
using backend.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace backend.Tests.Controllers;

public class WatchlistControllerTests
{
    private static Mock<ITmdbService> TmdbMock()
    {
        var mock = new Mock<ITmdbService>();
        mock.Setup(x => x.BuildPosterUrl(It.IsAny<string?>()))
            .Returns((string? path) => path is null ? null : $"https://image.test{path}");
        return mock;
    }

    [Fact]
    public async Task GetWatchlist_ReturnsOnlyCurrentUsersEntriesNewestFirst()
    {
        await using var db = TestDb.Create();
        var user = await TestDb.AddUserAsync(db);
        var other = await TestDb.AddUserAsync(db, "other", "other@example.com");
        var first = await TestDb.AddMovieAsync(db, 1, "First");
        var second = await TestDb.AddMovieAsync(db, 2, "Second");
        db.WatchlistEntries.AddRange(
            new Watchlist { UserId = user.UserId, MovieId = first.MovieId, AddedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Watchlist { UserId = user.UserId, MovieId = second.MovieId, AddedAt = new DateTime(2026, 2, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Watchlist { UserId = other.UserId, MovieId = first.MovieId });
        await db.SaveChangesAsync();
        var controller = new WatchlistController(db, TmdbMock().Object, Mock.Of<IMovieCacheService>(), Mock.Of<IGamificationService>()).AsUser(user.UserId);

        var result = await controller.GetWatchlist();

        var items = result.ValueFromOk();
        Assert.Equal(2, items.Count);
        Assert.Equal("Second", items[0].Title);
    }

    [Fact]
    public async Task AddToWatchlist_AddsMovieAndReturnsAchievementFeedback()
    {
        await using var db = TestDb.Create();
        var user = await TestDb.AddUserAsync(db);
        var movie = await TestDb.AddMovieAsync(db);
        var cache = new Mock<IMovieCacheService>();
        cache.Setup(x => x.GetOrCacheMovieAsync(movie.TmdbId)).ReturnsAsync(movie);
        var gamification = new Mock<IGamificationService>();
        gamification.Setup(x => x.CheckWatchlistAchievementsAsync(user.UserId))
            .ReturnsAsync(new GamificationResult(20, false, "Rookie Critic", [new AchievementUnlock("PROCRASTINATOR_20", "Procrastinator", null, 20)]));
        var controller = new WatchlistController(db, TmdbMock().Object, cache.Object, gamification.Object).AsUser(user.UserId);

        var result = await controller.AddToWatchlist(new AddWatchlistRequest(movie.TmdbId));

        var response = result.ValueFromOk();
        Assert.Equal(movie.TmdbId, response.Item.TmdbId);
        Assert.Equal(20, response.Gamification.PointsAwarded);
        Assert.Single(response.Gamification.UnlockedAchievements);
        Assert.Single(db.WatchlistEntries);
    }

    [Fact]
    public async Task AddToWatchlist_ReturnsConflictForDuplicate()
    {
        await using var db = TestDb.Create();
        var user = await TestDb.AddUserAsync(db);
        var movie = await TestDb.AddMovieAsync(db);
        db.WatchlistEntries.Add(new Watchlist { UserId = user.UserId, MovieId = movie.MovieId });
        await db.SaveChangesAsync();
        var cache = new Mock<IMovieCacheService>();
        cache.Setup(x => x.GetOrCacheMovieAsync(movie.TmdbId)).ReturnsAsync(movie);
        var controller = new WatchlistController(db, TmdbMock().Object, cache.Object, Mock.Of<IGamificationService>()).AsUser(user.UserId);

        var result = await controller.AddToWatchlist(new AddWatchlistRequest(movie.TmdbId));

        Assert.IsType<ConflictObjectResult>(result.Result);
    }

    [Fact]
    public async Task AddToWatchlist_ReturnsNotFoundWhenTmdbMovieMissing()
    {
        await using var db = TestDb.Create();
        var user = await TestDb.AddUserAsync(db);
        var cache = new Mock<IMovieCacheService>();
        cache.Setup(x => x.GetOrCacheMovieAsync(999)).ReturnsAsync((Movie?)null);
        var controller = new WatchlistController(db, TmdbMock().Object, cache.Object, Mock.Of<IGamificationService>()).AsUser(user.UserId);

        var result = await controller.AddToWatchlist(new AddWatchlistRequest(999));

        Assert.IsType<NotFoundObjectResult>(result.Result);
    }

    [Fact]
    public async Task RemoveFromWatchlist_RemovesOnlyCurrentUsersMatchingMovie()
    {
        await using var db = TestDb.Create();
        var user = await TestDb.AddUserAsync(db);
        var other = await TestDb.AddUserAsync(db, "other", "other@example.com");
        var movie = await TestDb.AddMovieAsync(db);
        db.WatchlistEntries.AddRange(
            new Watchlist { UserId = user.UserId, MovieId = movie.MovieId },
            new Watchlist { UserId = other.UserId, MovieId = movie.MovieId });
        await db.SaveChangesAsync();
        var controller = new WatchlistController(db, TmdbMock().Object, Mock.Of<IMovieCacheService>(), Mock.Of<IGamificationService>()).AsUser(user.UserId);

        var result = await controller.RemoveFromWatchlist(movie.TmdbId);

        Assert.IsType<NoContentResult>(result);
        Assert.Single(db.WatchlistEntries);
        Assert.Equal(other.UserId, (await db.WatchlistEntries.SingleAsync()).UserId);
    }

    [Fact]
    public async Task RemoveFromWatchlist_ReturnsNotFoundWhenEntryMissing()
    {
        await using var db = TestDb.Create();
        var user = await TestDb.AddUserAsync(db);
        var controller = new WatchlistController(db, TmdbMock().Object, Mock.Of<IMovieCacheService>(), Mock.Of<IGamificationService>()).AsUser(user.UserId);

        var result = await controller.RemoveFromWatchlist(999);

        Assert.IsType<NotFoundObjectResult>(result);
    }
}
