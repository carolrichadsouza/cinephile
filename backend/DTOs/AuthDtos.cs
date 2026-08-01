using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public record RegisterRequest(
    [Required, MinLength(3), MaxLength(30)]
    [RegularExpression(@"^[a-zA-Z0-9_]+$", ErrorMessage = "Username can only contain letters, numbers, and underscores.")]
    string Username,

    [Required, EmailAddress, MaxLength(255)]
    string Email,

    [Required, MinLength(8), MaxLength(100)]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$",
        ErrorMessage = "Password must include an uppercase letter, lowercase letter, number, and special character.")]
    string Password
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
