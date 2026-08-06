using Microsoft.AspNetCore.Mvc;

namespace backend.Tests.Helpers;

internal static class ActionResultExtensions
{
    public static T ValueFromOk<T>(this ActionResult<T> actionResult)
    {
        var ok = Assert.IsType<OkObjectResult>(actionResult.Result);
        return Assert.IsType<T>(ok.Value);
    }

    public static T ValueFromCreated<T>(this ActionResult<T> actionResult)
    {
        var created = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
        return Assert.IsType<T>(created.Value);
    }
}
