using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class AppUser : IdentityUser
{
    public IList<Guild> OwnedGuilds { get; set; } = new List<Guild>();
    public IList<GuildMembership> Memberships { get; set; } = new List<GuildMembership>();
}