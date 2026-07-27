using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class CinephileDbContext(DbContextOptions<CinephileDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Level> Levels => Set<Level>();
    public DbSet<Movie> Movies => Set<Movie>();
    public DbSet<Log> Logs => Set<Log>();
    public DbSet<Watchlist> WatchlistEntries => Set<Watchlist>();
    public DbSet<Achievement> Achievements => Set<Achievement>();
    public DbSet<UserAchievement> UserAchievements => Set<UserAchievement>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // --- Level ---
        modelBuilder.Entity<Level>(entity =>
        {
            entity.HasIndex(l => l.LevelName).IsUnique();
        });

        // --- User ---
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Username).IsUnique();
            entity.HasIndex(u => u.Email).IsUnique();

            entity.HasOne(u => u.Level)
                  .WithMany(l => l.Users)
                  .HasForeignKey(u => u.LevelId)
                  // Don't let a level be deleted while users still reference it.
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // --- Movie ---
        modelBuilder.Entity<Movie>(entity =>
        {
            entity.HasIndex(m => m.TmdbId).IsUnique();
        });

        // --- Log ---
        modelBuilder.Entity<Log>(entity =>
        {
            entity.HasOne(l => l.User)
                  .WithMany(u => u.Logs)
                  .HasForeignKey(l => l.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(l => l.Movie)
                  .WithMany(m => m.Logs)
                  .HasForeignKey(l => l.MovieId)
                  .OnDelete(DeleteBehavior.Cascade);

            // Speeds up "has this user already logged this movie" checks and profile queries.
            entity.HasIndex(l => new { l.UserId, l.MovieId });
            entity.HasIndex(l => new { l.UserId, l.WatchedDate });
        });

        // --- Watchlist ---
        modelBuilder.Entity<Watchlist>(entity =>
        {
            entity.HasOne(w => w.User)
                  .WithMany(u => u.WatchlistEntries)
                  .HasForeignKey(w => w.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(w => w.Movie)
                  .WithMany(m => m.WatchlistEntries)
                  .HasForeignKey(w => w.MovieId)
                  .OnDelete(DeleteBehavior.Cascade);

            // A user can only have a given movie on their watchlist once.
            entity.HasIndex(w => new { w.UserId, w.MovieId }).IsUnique();
        });

        // --- Achievement ---
        modelBuilder.Entity<Achievement>(entity =>
        {
            entity.HasIndex(a => a.Code).IsUnique();
        });

        // --- UserAchievement (composite PK) ---
        modelBuilder.Entity<UserAchievement>(entity =>
        {
            entity.HasKey(ua => new { ua.UserId, ua.AchievementId });

            entity.HasOne(ua => ua.User)
                  .WithMany(u => u.UserAchievements)
                  .HasForeignKey(ua => ua.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ua => ua.Achievement)
                  .WithMany(a => a.UserAchievements)
                  .HasForeignKey(ua => ua.AchievementId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
