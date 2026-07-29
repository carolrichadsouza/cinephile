namespace backend.DTOs;

public record UserProfileResponse(
    int UserId,
    string Username,
    string Email,
    string? DisplayName,
    string? Bio,
    string? AvatarPath,
    int Points,
    int LevelId,
    string LevelName
);
