namespace API.Entities;

public class GuildRole
{
    public required string Id { get; set; }
    public required string GuildId { get; set; }
    public Guild? Guild { get; set; }

    public required string Name { get; set; }

    public static List<GuildRole> CreateDefaultGuildRoles(string guildId,
        out string defaultRoleId, out string ownerRoleId)
    {
        var roleNames = new List<string>
        {
            GuildRoles.Owner, GuildRoles.Admin, GuildRoles.Moderator, GuildRoles.Member
        };
        var roles = roleNames.Select(name => new GuildRole
        {
            Id = Guid.NewGuid().ToString(),
            GuildId = guildId,
            Name = name
        }).ToList();
        
         defaultRoleId = roles.First(r => r.Name == GuildRoles.Member).Id;
         ownerRoleId = roles.First(r => r.Name == GuildRoles.Owner).Id;
         return roles;
    }
}

public static class GuildRoles
{
    public const string Owner = "Owner";
    public const string Admin = "Admin";
    public const string Moderator = "Moderator";
    public const string Member = "Member";
}