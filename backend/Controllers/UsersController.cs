using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;

namespace backend.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController(CinephileDbContext db) : ControllerBase
{

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

        return Ok(new UserProfileResponse(
            user.UserId,
            user.Username,
            user.Email,
            user.DisplayName,
            user.Bio,
            user.AvatarPath,
            user.Points,
            user.LevelId,
            user.Level.LevelName
        ));
    }
}
