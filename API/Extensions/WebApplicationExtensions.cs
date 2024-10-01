using API.Data;
using API.Data.Seeds;
using API.Entities;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class WebApplicationExtensions
{
    public static async void ApplyMigrations(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var service = scope.ServiceProvider;
        try
        {
            var context = service.GetRequiredService<DataContext>();
            await context.Database.MigrateAsync();
        }
        catch (Exception ex)
        {
            var logger = service.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "An error occurred during migration");
        }
    }

    public static async void SeedUser(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var service = scope.ServiceProvider;
        try
        {
            var userManager = service.GetRequiredService<UserManager<AppUser>>();
            await UserSeed.SeedUser(userManager, app.Configuration);
        }
        catch (Exception ex)
        {
            var logger = service.GetRequiredService<ILogger<Program>>();
            logger.LogWarning(ex, "No user has been seeded");
        }
    }

    public static async void SeedTiles(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var service = scope.ServiceProvider;
        try
        {
            var mapper = service.GetRequiredService<IMapper>();
            var unitOfWork = service.GetRequiredService<UnitOfWork>();
            var imageService = service.GetRequiredService<ImageService>();
            await TileSeed.SeedTiles(mapper, unitOfWork, imageService);
        }
        catch (Exception ex)
        {
            var logger = service.GetRequiredService<ILogger<Program>>();
            logger.LogWarning(ex, "No user has been seeded");
        }
    }
}