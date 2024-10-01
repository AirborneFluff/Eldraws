using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Seeds;

public sealed class UserSeed()
{
    public static async Task SeedUser(UserManager<AppUser> userManager, IConfiguration config)
    {
        if (await userManager.Users.AnyAsync()) return;
        
        var userName = 
            config.GetValue<string>("UserSeed:UserName") ?? throw new InvalidOperationException();
        var userId = 
            config.GetValue<string>("UserSeed:Id") ?? throw new InvalidOperationException();
    
        var user = new AppUser
        {
            Id = userId,
            UserName = userName
        };

        await userManager.CreateAsync(user);
    }
}