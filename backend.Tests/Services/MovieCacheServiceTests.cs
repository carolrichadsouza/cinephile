using backend.DTOs;
using backend.Services;
using backend.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace backend.Tests.Services;

public class MovieCacheServiceTests
{
    [Fact]
    public async Task GetOrCacheMovie_ReturnsExistingMovieWithoutCallingTmdb()
    {
        await using var db = TestDb.Create();
        var existing = await TestDb.AddMovieAsync(db);
        var tmdb = new Mock<ITmdbService>();
        var service = new MovieCacheService(db, tmdb.Object);

        var result = await service.GetOrCacheMovieAsync(existing.TmdbId);

        Assert.Same(existing, result);
        tmdb.Verify(x => x.GetMovieDetailAsync(It.IsAny<int>()), Times.Never);
    }

    [Fact]
    public async Task GetOrCacheMovie_FetchesMapsAndPersistsMissingMovie()
    {
        await using var db = TestDb.Create();
        var tmdb = new Mock<ITmdbService>();
        tmdb.Setup(x => x.GetMovieDetailAsync(123)).ReturnsAsync(new TmdbMovieDetail(
            123, "Test Movie", "/test.jpg", "2025-05-01", "Overview", 125,
            [new TmdbGenre(18, "Drama"), new TmdbGenre(53, "Thriller")]));
        var service = new MovieCacheService(db, tmdb.Object);

        var result = await service.GetOrCacheMovieAsync(123);

        Assert.NotNull(result);
        Assert.Equal("Test Movie", result.Title);
        Assert.Equal(new DateOnly(2025, 5, 1), result.ReleaseDate);
        Assert.Equal("Drama,Thriller", result.Genres);
        Assert.Equal(125, result.RuntimeMinutes);
        Assert.Equal(1, await db.Movies.CountAsync());
    }

    [Fact]
    public async Task GetOrCacheMovie_StoresNullReleaseDateWhenDateIsInvalid()
    {
        await using var db = TestDb.Create();
        var tmdb = new Mock<ITmdbService>();
        tmdb.Setup(x => x.GetMovieDetailAsync(123)).ReturnsAsync(new TmdbMovieDetail(
            123, "Test Movie", null, "not-a-date", null, null, []));
        var service = new MovieCacheService(db, tmdb.Object);

        var result = await service.GetOrCacheMovieAsync(123);

        Assert.NotNull(result);
        Assert.Null(result.ReleaseDate);
        Assert.Null(result.Genres);
    }

    [Fact]
    public async Task GetOrCacheMovie_ReturnsNullWhenTmdbCannotFindMovie()
    {
        await using var db = TestDb.Create();
        var tmdb = new Mock<ITmdbService>();
        tmdb.Setup(x => x.GetMovieDetailAsync(999)).ReturnsAsync((TmdbMovieDetail?)null);
        var service = new MovieCacheService(db, tmdb.Object);

        var result = await service.GetOrCacheMovieAsync(999);

        Assert.Null(result);
        Assert.Empty(db.Movies);
    }
}
