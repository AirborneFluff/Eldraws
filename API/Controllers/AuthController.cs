using System.Collections.ObjectModel;
using System.Security.Claims;
using API.Data.DTOs;
using API.Entities;
using API.Helpers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class AuthController(UserManager<AppUser> userManager, DiscordAuthenticationHelper discordAuth, IConfiguration config) : BaseApiController
{
    private readonly string _loginRedirectUrl = 
        config.GetValue<string>("Client:LoginRedirectUrl") ?? throw new InvalidOperationException();
    
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
            await HttpSignin(userExists);
            return Redirect(_loginRedirectUrl);
        }

        var result = await userManager.CreateAsync(user);
        if (!result.Succeeded)
        {
            var errorMsg = result.Errors.FirstOrDefault()?.Description;
            return BadRequest(errorMsg ?? "Issue creating user");
        }

        await HttpSignin(user);
        return Redirect(_loginRedirectUrl);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Ok();
    }

    [HttpGet("getUser")]
    [Authorize]
    public async Task<IActionResult> GetUser()
    {
        var user = new UserDto()
        {
            Id = User.Claims.Single(claim => claim.Type == ClaimTypes.NameIdentifier).Value,
            Email = User.Claims.Single(claim => claim.Type == ClaimTypes.Email).Value,
            UserName = User.Claims.Single(claim => claim.Type == ClaimTypes.Name).Value
        };
        
        return Ok(user);
    }

    private Task HttpSignin(AppUser user)
    {
        var claims = new Collection<Claim>()
        {
            new (ClaimTypes.NameIdentifier, user.Id),
            new (ClaimTypes.Email, user.Email!),
            new (ClaimTypes.Name, user.UserName!),
        };
        
        var claimsIdentity = new ClaimsIdentity(
            claims, CookieAuthenticationDefaults.AuthenticationScheme);

        return HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme, 
            new ClaimsPrincipal(claimsIdentity));
    }
}