using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(CinephileDbContext db, ITokenService tokenService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        if (await db.Users.AnyAsync(u => u.Username == request.Username))
            return Conflict(new { message = "Username is already taken." });

        if (await db.Users.AnyAsync(u => u.Email == request.Email))
            return Conflict(new { message = "Email is already registered." });

        // Every new user starts at the base level (seeded as LevelId = 1).
        var startingLevel = await db.Levels.OrderBy(l => l.PointsRequired).FirstOrDefaultAsync();
        if (startingLevel is null)
            return StatusCode(500, new { message = "No levels are configured. Run migrations first." });

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            LevelId = startingLevel.LevelId,
            Points = 0
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        var token = tokenService.GenerateToken(user);
        return Ok(new AuthResponse(token, user.UserId, user.Username, user.Email, user.DisplayName, user.Points, user.LevelId));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        // Deliberately vague on which part was wrong (email vs password) — don't
        // let attackers use this endpoint to enumerate registered emails.
        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password." });

        var token = tokenService.GenerateToken(user);
        return Ok(new AuthResponse(token, user.UserId, user.Username, user.Email, user.DisplayName, user.Points, user.LevelId));
    }
}
