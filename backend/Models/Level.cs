using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Level
{
    public int LevelId { get; set; }

    [MaxLength(50)] public required string LevelName { get; set; }

    public required int PointsRequired { get; set; }

    public List<User> Users { get; set; } = [];
}
