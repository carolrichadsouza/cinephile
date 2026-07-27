namespace backend.Models;

public class Watchlist
{
    public int WatchlistId { get; set; }

    public required int UserId { get; set; }
    public User User { get; set; } = null!;

    public required int MovieId { get; set; }
    public Movie Movie { get; set; } = null!;

    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}
