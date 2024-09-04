using System.Collections.ObjectModel;
using System.Security.Claims;
using API.Entities;
using API.Helpers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class AuthController(UserManager<AppUser> userManager, DiscordAuthenticationHelper discordAuth) : BaseApiController
{
    [HttpGet("signin-discord")]
    public async Task<IActionResult> DiscordCallback(string code)
    {
        var tokenResponse = await discordAuth.ExchangeCode(code);
        if (tokenResponse == null) return BadRequest();
        
        var user = await DiscordAuthenticationHelper.CreateUserFromDiscord(tokenResponse.AccessToken);
        if (user == null) return BadRequest();

        var userExists = await userManager.FindByEmailAsync(user.Email!);
        if (userExists != null)
        {
            await HttpSignin(user);
            return Ok();
        }

        var result = await userManager.CreateAsync(user);
        if (!result.Succeeded)
        {
            var errorMsg = result.Errors.FirstOrDefault()?.Description;
            return BadRequest(errorMsg ?? "Issue creating user");
        }

        await HttpSignin(user);
        return Ok();
    }

    [HttpGet("test")]
    [Authorize]
    public async Task<IActionResult> LoginTest()
    {
        return Ok(User.Claims.FirstOrDefault()!.Value);
    }

    private Task HttpSignin(AppUser user)
    {
        var claims = new Collection<Claim>()
        {
            new (ClaimTypes.Email, user.Email!),
            new (ClaimTypes.NameIdentifier, user.UserName!),
        };
        
        var claimsIdentity = new ClaimsIdentity(
            claims, CookieAuthenticationDefaults.AuthenticationScheme);

        return HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme, 
            new ClaimsPrincipal(claimsIdentity));
    }
}