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

            entity.HasData(
                new Level { LevelId = 1, LevelName = "Rookie Critic", PointsRequired = 0 },
                new Level { LevelId = 2, LevelName = "Popcorn Enthusiast", PointsRequired = 50 },
                new Level { LevelId = 3, LevelName = "Casual Viewer", PointsRequired = 120 },
                new Level { LevelId = 4, LevelName = "Weekend Watcher", PointsRequired = 220 },
                new Level { LevelId = 5, LevelName = "Movie Night Regular", PointsRequired = 350 },
                new Level { LevelId = 6, LevelName = "Screen Devotee", PointsRequired = 520 },
                new Level { LevelId = 7, LevelName = "Genre Explorer", PointsRequired = 730 },
                new Level { LevelId = 8, LevelName = "Film Aficionado", PointsRequired = 990 },
                new Level { LevelId = 9, LevelName = "Reel Enthusiast", PointsRequired = 1300 },
                new Level { LevelId = 10, LevelName = "Cinephile in Training", PointsRequired = 1690 },
                new Level { LevelId = 11, LevelName = "Seasoned Viewer", PointsRequired = 2150 },
                new Level { LevelId = 12, LevelName = "Seasoned Cinephile", PointsRequired = 2690 },
                new Level { LevelId = 13, LevelName = "Film Scholar", PointsRequired = 3320 },
                new Level { LevelId = 14, LevelName = "Cinema Connoisseur", PointsRequired = 4050 },
                new Level { LevelId = 15, LevelName = "Master Cinephile", PointsRequired = 4890 },
                new Level { LevelId = 16, LevelName = "Archive Keeper", PointsRequired = 5850 },
                new Level { LevelId = 17, LevelName = "Legendary Viewer", PointsRequired = 6940 },
                new Level { LevelId = 18, LevelName = "Cinema Sage", PointsRequired = 8170 },
                new Level { LevelId = 19, LevelName = "Grand Cinephile", PointsRequired = 9550 },
                new Level { LevelId = 20, LevelName = "True Cinephile", PointsRequired = 11090 }
            );
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

            entity.HasData(
                new Achievement { AchievementId = 1, Code = "FIRST_LOG", Name = "First Reel", Details = "Log your very first film.", Points = 10 },
                new Achievement { AchievementId = 2, Code = "MARATHONER", Name = "Marathoner", Details = "Watch 5 movies in a single week.", Points = 25 },
                new Achievement { AchievementId = 3, Code = "CENTURION", Name = "Centurion", Details = "Log 100 films watched.", Points = 150 },
                new Achievement { AchievementId = 4, Code = "CRITIC_10", Name = "The Critic", Details = "Write 10 reviews.", Points = 40 },
                new Achievement { AchievementId = 5, Code = "EXPLORER_8", Name = "Explorer", Details = "Watch a film from 8 different genres.", Points = 35 },
                new Achievement { AchievementId = 6, Code = "DEVOTED_30", Name = "Devoted", Details = "Maintain a 30-day viewing streak.", Points = 100 },
                new Achievement { AchievementId = 7, Code = "PROCRASTINATOR_20", Name = "Procrastinator", Details = "Keep 20 movies in your watchlist.", Points = 20 },
                new Achievement { AchievementId = 8, Code = "TRUE_CINEPHILE_LVL20", Name = "True Cinephile", Details = "Reach Level 20.", Points = 200 }
            );
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
