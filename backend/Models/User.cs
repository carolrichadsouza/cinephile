using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class User
{
    public int UserId { get; set; }
    [MaxLength(30)] public required string Username { get; set; }
    [MaxLength(255)] public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    
    [MaxLength(280)] public string? Bio { get; set; }
    [MaxLength(50)] public string? DisplayName { get; set; }
    public string? AvatarPath { get; set; }

    public DateTime DateCreated { get; set; } = DateTime.UtcNow;

    public required int LevelId { get; set; }
    public Level Level { get; set; } = null!;
    public int Points { get; set; } = 0;

    public List<Log> Logs { get; set; } = [];
    public List<Watchlist> WatchlistEntries { get; set; } = [];
    public List<UserAchievement> UserAchievements { get; set; } = [];

}
