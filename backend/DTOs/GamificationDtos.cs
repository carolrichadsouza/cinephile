namespace backend.DTOs;

public record AchievementResponse(
    string Code,
    string Name,
    string? Details,
    int Points,
    bool Earned,
    DateTime? EarnedAt,
    int CurrentProgress,
    int TargetProgress
);

public record GenreBreakdownItem(string Genre, double Percentage);

public record ActivityItem(string Type, string Description, DateTime Timestamp);

public record ProfileStatsResponse(
    int FilmsWatched,
    int InWatchlist,
    int ReviewsWritten,
    double HoursWatched,
    string? FavoriteGenre,
    int WatchedThisYear,
    int CurrentStreak,
    double? AverageRating,
    List<GenreBreakdownItem> GenreBreakdown,
    List<ActivityItem> RecentActivity
);

public record AchievementUnlockDto(string Code, string Name, string? Details, int Points);

public record GamificationFeedback(
    int PointsAwarded,
    bool LeveledUp,
    string? NewLevelName,
    List<AchievementUnlockDto> UnlockedAchievements
);
