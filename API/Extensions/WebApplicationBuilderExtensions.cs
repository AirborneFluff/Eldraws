using API.ActionFilters;
using API.Data;
using API.Entities;
using API.Helpers;
using API.Services;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class WebApplicationBuilderExtensions
{
    public static void ConfigureServices(this WebApplicationBuilder builder)
    {
        builder.AddCustomServices();
        builder.AddDataContext();
        builder.AddIdentityServices();
        builder.AddActionFilters();
        builder.Services.AddControllers();
    }

    private static void AddDataContext(this WebApplicationBuilder builder)
    {
        builder.Services.AddDbContext<DataContext>(options => {
            var connStr = builder.Configuration.GetConnectionString("DefaultConnection");
            options.UseSqlite(connStr);
        });
    }

    private static void AddIdentityServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddIdentityCore<AppUser>()
            .AddRoles<IdentityRole>()
            .AddRoleManager<RoleManager<IdentityRole>>()
            .AddSignInManager<SignInManager<AppUser>>()
            .AddRoleValidator<RoleValidator<IdentityRole>>()
            .AddEntityFrameworkStores<DataContext>()
            .AddDefaultTokenProviders();

        builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            })
            .AddCookie(options =>
            {
                options.ExpireTimeSpan = TimeSpan.FromHours(600);
                options.Cookie.MaxAge = options.ExpireTimeSpan;
                options.SlidingExpiration = true;
                options.Cookie.SameSite = SameSiteMode.None;
            });

        builder.Services.AddScoped<UserManager<AppUser>>();
        builder.Services.AddScoped<SignInManager<AppUser>>();
    }

    private static void AddCustomServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddScoped<UnitOfWork>();
        builder.Services.AddScoped<DiscordAuthenticationHelper>();
        builder.Services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
        builder.Services.AddSingleton(x => new BlobServiceClient(builder.Configuration.GetConnectionString("AzureBlobStorage")));
        builder.Services.AddScoped<ImageService>();
    }

    private static void AddActionFilters(this WebApplicationBuilder builder)
    {
        builder.Services.AddScoped<ValidateGuildExists>();
        builder.Services.AddScoped<ValidateGuildOwner>();
        builder.Services.AddScoped<ValidateGuildMember>();
        builder.Services.AddScoped<ValidateEventExists>();
        builder.Services.AddScoped<ValidateBingoEventExists>();
        builder.Services.AddScoped<ValidateBingoEventHost>();
    }
}