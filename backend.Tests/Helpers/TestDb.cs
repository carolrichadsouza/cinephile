using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Tests.Helpers;

internal static class TestDb
{
    public static CinephileDbContext Create(string? name = null)
    {
        var options = new DbContextOptionsBuilder<CinephileDbContext>()
            .UseInMemoryDatabase(name ?? Guid.NewGuid().ToString())
            .EnableSensitiveDataLogging()
            .Options;

        var db = new CinephileDbContext(options);
        db.Database.EnsureCreated();
        return db;
    }

    public static async Task<User> AddUserAsync(
        CinephileDbContext db,
        string username = "testing",
        string email = "testing@example.com",
        int points = 0,
        int levelId = 1)
    {
        var user = new User
        {
            Username = username,
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
            LevelId = levelId,
            Points = points
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();
        return user;
    }

    public static async Task<Movie> AddMovieAsync(
        CinephileDbContext db,
        int tmdbId = 550,
        string title = "Fight Club",
        string? genres = "Drama",
        int? runtime = 139)
    {
        var movie = new Movie
        {
            TmdbId = tmdbId,
            Title = title,
            PosterPath = "/poster.jpg",
            ReleaseDate = new DateOnly(1999, 10, 15),
            RuntimeMinutes = runtime,
            Genres = genres
        };

        db.Movies.Add(movie);
        await db.SaveChangesAsync();
        return movie;
    }
}
