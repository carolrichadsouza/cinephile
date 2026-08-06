using backend.Controllers;
using backend.DTOs;
using backend.Services;
using backend.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace backend.Tests.Controllers;

public class AuthControllerTests
{
    [Fact]
    public async Task Register_CreatesUserWithHashedPasswordAndStartingLevel()
    {
        await using var db = TestDb.Create();
        var tokenService = new Mock<ITokenService>();
        tokenService.Setup(x => x.GenerateToken(It.IsAny<backend.Models.User>())).Returns("test-token");
        var controller = new AuthController(db, tokenService.Object);

        var result = await controller.Register(new RegisterRequest("newuser", "new@example.com", "Password123!"));

        var response = result.ValueFromOk();
        var saved = await db.Users.SingleAsync(u => u.Email == "new@example.com");
        Assert.Equal("test-token", response.Token);
        Assert.Equal(1, saved.LevelId);
        Assert.Equal(0, saved.Points);
        Assert.NotEqual("Password123!", saved.PasswordHash);
        Assert.True(BCrypt.Net.BCrypt.Verify("Password123!", saved.PasswordHash));
    }

    [Fact]
    public async Task Register_ReturnsConflictForDuplicateUsername()
    {
        await using var db = TestDb.Create();
        await TestDb.AddUserAsync(db, username: "taken", email: "first@example.com");
        var controller = new AuthController(db, Mock.Of<ITokenService>());

        var result = await controller.Register(new RegisterRequest("taken", "other@example.com", "Password123!"));

        Assert.IsType<ConflictObjectResult>(result.Result);
        Assert.Equal(1, await db.Users.CountAsync());
    }

    [Fact]
    public async Task Register_ReturnsConflictForDuplicateEmail()
    {
        await using var db = TestDb.Create();
        await TestDb.AddUserAsync(db, username: "first", email: "taken@example.com");
        var controller = new AuthController(db, Mock.Of<ITokenService>());

        var result = await controller.Register(new RegisterRequest("other", "taken@example.com", "Password123!"));

        Assert.IsType<ConflictObjectResult>(result.Result);
    }

    [Fact]
    public async Task Register_Returns500WhenNoLevelsAreConfigured()
    {
        await using var db = TestDb.Create();
        db.Levels.RemoveRange(db.Levels);
        await db.SaveChangesAsync();
        var controller = new AuthController(db, Mock.Of<ITokenService>());

        var result = await controller.Register(new RegisterRequest("newuser", "new@example.com", "Password123!"));

        var objectResult = Assert.IsType<ObjectResult>(result.Result);
        Assert.Equal(500, objectResult.StatusCode);
    }

    [Fact]
    public async Task Login_ReturnsTokenForValidCredentials()
    {
        await using var db = TestDb.Create();
        var user = await TestDb.AddUserAsync(db);
        var tokenService = new Mock<ITokenService>();
        tokenService.Setup(x => x.GenerateToken(user)).Returns("valid-token");
        var controller = new AuthController(db, tokenService.Object);

        var result = await controller.Login(new LoginRequest(user.Email, "Password123!"));

        var response = result.ValueFromOk();
        Assert.Equal("valid-token", response.Token);
        Assert.Equal(user.UserId, response.UserId);
    }

    [Theory]
    [InlineData("missing@example.com", "Password123!")]
    [InlineData("testing@example.com", "WrongPassword")]
    public async Task Login_ReturnsSameUnauthorizedResponseForUnknownEmailOrWrongPassword(string email, string password)
    {
        await using var db = TestDb.Create();
        await TestDb.AddUserAsync(db);
        var controller = new AuthController(db, Mock.Of<ITokenService>());

        var result = await controller.Login(new LoginRequest(email, password));

        Assert.IsType<UnauthorizedObjectResult>(result.Result);
    }
}
