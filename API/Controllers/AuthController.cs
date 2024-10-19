using System.Collections.ObjectModel;
using System.Security.Claims;
using API.Data.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using AutoMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class AuthController(UserManager<AppUser> userManager, DiscordAuthenticationHelper discordAuth, IConfiguration config, IMapper mapper) : BaseApiController
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

        var userExists = await userManager.FindByNameAsync(user.UserName!);
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
        var user = new UserDto
        {
            Id = User.Claims.Single(claim => claim.Type == ClaimTypes.NameIdentifier).Value,
            UserName = User.Claims.Single(claim => claim.Type == ClaimTypes.Name).Value,
            Gamertag = User.Claims.Single(claim => claim.Type == ClaimTypes.GivenName).Value
        };
        
        return Ok(user);
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> UpdateUser([FromBody] UserUpdateDto dto)
    {
        var user = await userManager.FindByIdAsync(User.GetUserId());
        if (user is null) return Unauthorized();
        
        mapper.Map(dto, user);

        var result = await userManager.UpdateAsync(user);
        if (result.Succeeded)
        {
            await HttpSignin(user);
            return Ok(mapper.Map<UserDto>(user));
        }
        
        var errorMsg = result.Errors.FirstOrDefault()?.Description;
        return BadRequest(errorMsg ?? "Issue updating user");

    }

    private Task HttpSignin(AppUser user)
    {
        var claims = new Collection<Claim>()
        {
            new (ClaimTypes.NameIdentifier, user.Id),
            new (ClaimTypes.Name, user.UserName!),
            new (ClaimTypes.GivenName, user.Gamertag ?? "")
        };
        
        var claimsIdentity = new ClaimsIdentity(
            claims, CookieAuthenticationDefaults.AuthenticationScheme);

        return HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme, 
            new ClaimsPrincipal(claimsIdentity));
    }
}