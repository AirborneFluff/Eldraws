using System.Security.Claims;

namespace API.Extensions;

public static class ClaimsPrincipleExtensions
{
    public static string GetUserId(this ClaimsPrincipal user)
    {
        return user.Claims.Single(claim => claim.Type == ClaimTypes.NameIdentifier).Value;
    }

    public static string GetUserName(this ClaimsPrincipal user)
    {
        return user.Claims.Single(claim => claim.Type == ClaimTypes.Name).Value;
    }

    public static string GetGamertag(this ClaimsPrincipal user)
    {
        return user.Claims.Single(claim => claim.Type == ClaimTypes.GivenName).Value;
    }
}