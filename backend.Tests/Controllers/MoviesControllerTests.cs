using backend.Controllers;
using backend.DTOs;
using backend.Models;
using backend.Services;
using backend.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace backend.Tests.Controllers;

public class MoviesControllerTests
{
    private static TmdbMovieResult Result(int id = 1, string title = "Movie", params int[] genres) =>
        new(id, title, "/poster.jpg", "2026-01-01", genres.ToList(), "Overview");

    [Fact]
    public async Task Search_ReturnsBadRequestForBlankQuery()
    {
        await using var db = TestDb.Create();
        var controller = new MoviesController(Mock.Of<ITmdbService>(), Mock.Of<IMovieCacheService>(), db);

        var result = await controller.Search("  ");

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task Search_MapsTmdbResultsPosterAndFirstKnownGenre()
    {
        await using var db = TestDb.Create();
        var tmdb = new Mock<ITmdbService>();
        tmdb.Setup(x => x.SearchMoviesAsync("fight")).ReturnsAsync([Result(550, "Fight Club", 18, 53)]);
        tmdb.Setup(x => x.BuildPosterUrl("/poster.jpg")).Returns("https://image.test/poster.jpg");
        var controller = new MoviesController(tmdb.Object, Mock.Of<IMovieCacheService>(), db);

        var result = await controller.Search("fight");

        var movies = result.ValueFromOk();
        Assert.Single(movies);
        Assert.Equal("Drama", movies[0].Genres.Single());
        Assert.Equal("https://image.test/poster.jpg", movies[0].PosterUrl);
    }

    [Fact]
    public async Task Recommended_UsesFavoriteLoggedGenre()
    {
        await using var db = TestDb.Create();
        var user = await TestDb.AddUserAsync(db);
        var movie = await TestDb.AddMovieAsync(db, genres: "Drama,Drama");
        db.Logs.Add(new Log { UserId = user.UserId, MovieId = movie.MovieId, WatchedDate = new DateOnly(2026, 1, 1) });
        await db.SaveChangesAsync();
        var tmdb = new Mock<ITmdbService>();
        tmdb.Setup(x => x.DiscoverByGenreAsync(18)).ReturnsAsync([Result(2, "Drama Recommendation", 18)]);
        var controller = new MoviesController(tmdb.Object, Mock.Of<IMovieCacheService>(), db).AsUser(user.UserId);

        var result = await controller.GetRecommended();

        var movies = result.ValueFromOk();
        Assert.Equal("Drama Recommendation", movies.Single().Title);
        tmdb.Verify(x => x.DiscoverByGenreAsync(18), Times.Once);
        tmdb.Verify(x => x.GetPopularMoviesAsync(), Times.Never);
    }

    [Fact]
    public async Task Recommended_FallsBackToPopularWithoutViewingHistory()
    {
        await using var db = TestDb.Create();
        var user = await TestDb.AddUserAsync(db);
        var tmdb = new Mock<ITmdbService>();
        tmdb.Setup(x => x.GetPopularMoviesAsync()).ReturnsAsync([Result(2, "Popular", 35)]);
        var controller = new MoviesController(tmdb.Object, Mock.Of<IMovieCacheService>(), db).AsUser(user.UserId);

        var result = await controller.GetRecommended();

        Assert.Equal("Popular", result.ValueFromOk().Single().Title);
        tmdb.Verify(x => x.GetPopularMoviesAsync(), Times.Once);
    }

    [Fact]
    public async Task GetByTmdbId_ReturnsCombinedDetailCreditsProvidersAndAverageAppRating()
    {
        await using var db = TestDb.Create();
        var user1 = await TestDb.AddUserAsync(db);
        var user2 = await TestDb.AddUserAsync(db, "other", "other@example.com");
        var movie = await TestDb.AddMovieAsync(db);
        db.Logs.AddRange(
            new Log { UserId = user1.UserId, MovieId = movie.MovieId, WatchedDate = new DateOnly(2026, 1, 1), Rating = 4 },
            new Log { UserId = user2.UserId, MovieId = movie.MovieId, WatchedDate = new DateOnly(2026, 1, 2), Rating = 5 });
        await db.SaveChangesAsync();
        var cache = new Mock<IMovieCacheService>();
        cache.Setup(x => x.GetOrCacheMovieAsync(movie.TmdbId)).ReturnsAsync(movie);
        var tmdb = new Mock<ITmdbService>();
        tmdb.Setup(x => x.GetMovieDetailAsync(movie.TmdbId)).ReturnsAsync(new TmdbMovieDetail(movie.TmdbId, movie.Title, movie.PosterPath, "1999-10-15", "Overview", 139, [new TmdbGenre(18, "Drama")]));
        tmdb.Setup(x => x.GetCreditsAsync(movie.TmdbId)).ReturnsAsync(new TmdbCreditsResponse(
            [new TmdbCastMember("Actor 2", 2), new TmdbCastMember("Actor 1", 1)],
            [new TmdbCrewMember("Director Name", "Director")]));
        tmdb.Setup(x => x.GetWatchProvidersAsync(movie.TmdbId)).ReturnsAsync(new TmdbWatchProvidersResponse(
            new Dictionary<string, TmdbWatchRegion> { ["NZ"] = new([new TmdbWatchProvider("Netflix", null)], null, null) }));
        var controller = new MoviesController(tmdb.Object, cache.Object, db);

        var result = await controller.GetByTmdbId(movie.TmdbId);

        var response = result.ValueFromOk();
        Assert.Equal(4.5, response.AppRating);
        Assert.Equal("Director Name", response.Director);
        Assert.Equal(["Actor 1", "Actor 2"], response.Cast);
        Assert.Equal(["Netflix"], response.WatchProviders);
    }

    [Fact]
    public async Task GetReviews_ExcludesCurrentUserAndEmptyReviewsAndOrdersNewestFirst()
    {
        await using var db = TestDb.Create();
        var current = await TestDb.AddUserAsync(db);
        var reviewer = await TestDb.AddUserAsync(db, "reviewer", "reviewer@example.com");
        var movie = await TestDb.AddMovieAsync(db);
        db.Logs.AddRange(
            new Log { UserId = current.UserId, MovieId = movie.MovieId, WatchedDate = new DateOnly(2026, 3, 1), Review = "My review" },
            new Log { UserId = reviewer.UserId, MovieId = movie.MovieId, WatchedDate = new DateOnly(2026, 2, 1), Review = "Visible review", Rating = 4 },
            new Log { UserId = reviewer.UserId, MovieId = movie.MovieId, WatchedDate = new DateOnly(2026, 1, 1), Review = null });
        await db.SaveChangesAsync();
        var controller = new MoviesController(Mock.Of<ITmdbService>(), Mock.Of<IMovieCacheService>(), db).AsUser(current.UserId);

        var result = await controller.GetReviews(movie.TmdbId);

        var reviews = result.ValueFromOk();
        Assert.Single(reviews);
        Assert.Equal("reviewer", reviews[0].Username);
        Assert.Equal("Visible review", reviews[0].Review);
    }
}
