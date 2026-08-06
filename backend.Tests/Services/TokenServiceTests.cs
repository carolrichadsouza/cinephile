using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using backend.Models;
using backend.Services;
using Microsoft.Extensions.Configuration;

namespace backend.Tests.Services;

public class TokenServiceTests
{
    private static TokenService CreateService() => new(new ConfigurationBuilder()
        .AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["Jwt:Key"] = "this-is-a-long-test-key-with-more-than-32-characters",
            ["Jwt:Issuer"] = "cinephile-tests",
            ["Jwt:Audience"] = "cinephile-client"
        })
        .Build());

    [Fact]
    public void GenerateToken_ContainsExpectedClaimsIssuerAudienceAndExpiry()
    {
        var service = CreateService();
        var user = new User
        {
            UserId = 42,
            Username = "carol",
            Email = "carol@example.com",
            PasswordHash = "hash",
            LevelId = 1
        };

        var rawToken = service.GenerateToken(user);
        var token = new JwtSecurityTokenHandler().ReadJwtToken(rawToken);

        Assert.Equal("cinephile-tests", token.Issuer);
        Assert.Contains("cinephile-client", token.Audiences);
        Assert.Equal("42", token.Claims.Single(c => c.Type == ClaimTypes.NameIdentifier).Value);
        Assert.Equal("carol", token.Claims.Single(c => c.Type == ClaimTypes.Name).Value);
        Assert.Equal("carol@example.com", token.Claims.Single(c => c.Type == ClaimTypes.Email).Value);
        Assert.InRange(token.ValidTo, DateTime.UtcNow.AddDays(6.9), DateTime.UtcNow.AddDays(7.1));
    }

    [Fact]
    public void GenerateToken_ThrowsWhenKeyIsMissing()
    {
        var service = new TokenService(new ConfigurationBuilder().Build());
        var user = new User { Username = "u", Email = "e@example.com", PasswordHash = "hash", LevelId = 1 };

        var ex = Assert.Throws<InvalidOperationException>(() => service.GenerateToken(user));
        Assert.Contains("Jwt:Key", ex.Message);
    }
}
