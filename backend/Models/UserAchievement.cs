namespace backend.Models;

public class UserAchievement
{
    public required int UserId { get; set; }
    public User User { get; set; } = null!;

    public required int AchievementId { get; set; }
    public Achievement Achievement { get; set; } = null!;

    public DateTime DateAchieved { get; set; } = DateTime.UtcNow;

    public int PointsAwarded { get; set; } = 0;
}
