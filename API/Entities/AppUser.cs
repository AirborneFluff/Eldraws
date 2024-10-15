using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class AppUser : IdentityUser
{
    public string? Gamertag { get; set; }
    public IList<Guild> OwnedGuilds { get; set; } = new List<Guild>();
    public IList<GuildMembership> Memberships { get; set; } = new List<GuildMembership>();
    public IList<GuildApplication> Applications { get; set; } = new List<GuildApplication>();
    public IList<GuildApplication> ReviewedApplications { get; set; } = new List<GuildApplication>();
}