using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Achievement
{
    public int AchievementId { get; set; }

    [MaxLength(50)] public required string Code { get; set; }

    [MaxLength(100)] public required string Name { get; set; }

    [MaxLength(280)] public string? Details { get; set; }

    public int Points { get; set; } = 0;

    public List<UserAchievement> UserAchievements { get; set; } = [];
}
