using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public record RegisterRequest(
    [Required, MinLength(3), MaxLength(30)] string Username,
    [Required, EmailAddress] string Email,
    [Required, MinLength(8)] string Password
);

public record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required] string Password
);

public record AuthResponse(
    string Token,
    int UserId,
    string Username,
    string Email,
    string? DisplayName,
    int Points,
    int LevelId
);
