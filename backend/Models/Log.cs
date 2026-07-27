using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Log
{
    public int LogId { get; set; }

    public required int UserId { get; set; }
    public User User { get; set; } = null!;

       public required int MovieId { get; set; }
    public Movie Movie { get; set; } = null!;

    public required DateOnly WatchedDate { get; set; }

    [Range(0, 5)] public double? Rating { get; set; }

    [MaxLength(4000)] public string? Review { get; set; }

    public bool Rewatch { get; set; } = false;

    public int PointsEarned { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
