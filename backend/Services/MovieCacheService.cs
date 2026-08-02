using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Services;

public interface IMovieCacheService
{
    Task<Movie?> GetOrCacheMovieAsync(int tmdbId);
}

public class MovieCacheService(CinephileDbContext db, ITmdbService tmdb) : IMovieCacheService
{
    public async Task<Movie?> GetOrCacheMovieAsync(int tmdbId)
    {
        var existing = await db.Movies.FirstOrDefaultAsync(m => m.TmdbId == tmdbId);
        if (existing is not null) return existing;

        var detail = await tmdb.GetMovieDetailAsync(tmdbId);
        if (detail is null) return null;

        var movie = new Movie
        {
            TmdbId = detail.Id,
            Title = detail.Title,
            PosterPath = detail.PosterPath,
            ReleaseDate = DateOnly.TryParse(detail.ReleaseDate, out var date) ? date : null,
            RuntimeMinutes = detail.Runtime,
            CachedAt = DateTime.UtcNow
        };

        db.Movies.Add(movie);
        await db.SaveChangesAsync();
        return movie;
    }
}
