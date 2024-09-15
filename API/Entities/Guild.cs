namespace API.Entities;

public class Guild
{
    public required string Id { get; set; }
    public required string OwnerId { get; set; }
    public AppUser? Owner { get; set; }
    public required string Name { get; set; }
    public required string DefaultGuildMemberRoleId { get; set; }
    public bool Archived { get; set; } = false;
    public IList<GuildMembership> Memberships { get; set; } = new List<GuildMembership>();
    public IList<GuildApplication> Applications { get; set; } = new List<GuildApplication>();
    public IList<GuildBlacklist> Blacklist { get; set; } = new List<GuildBlacklist>();
    public IList<GuildRole> Roles { get; set; } = new List<GuildRole>();
}