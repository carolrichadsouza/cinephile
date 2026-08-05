using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController(CinephileDbContext db, IGamificationService gamification) : ControllerBase
{
    private int? GetUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(claim, out var id) ? id : null;
    }

    [HttpGet("me")]
    public async Task<ActionResult<UserProfileResponse>> GetCurrentUser()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdClaim is null || !int.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var user = await db.Users
            .Include(u => u.Level)
            .FirstOrDefaultAsync(u => u.UserId == userId);

        if (user is null)
            return NotFound();

        var nextLevel = await db.Levels
            .Where(l => l.PointsRequired > user.Level.PointsRequired)
            .OrderBy(l => l.PointsRequired)
            .FirstOrDefaultAsync();

        var currentStreak = await gamification.GetCurrentStreakAsync(userId);

        return Ok(new UserProfileResponse(
            user.UserId,
            user.Username,
            user.Email,
            user.DisplayName,
            user.Bio,
            user.AvatarPath,
            user.Points,
            user.LevelId,
            user.Level.LevelName,
            user.Level.PointsRequired,
            nextLevel?.LevelName,
            nextLevel?.PointsRequired,
            currentStreak
        ));
    }
}
