namespace API.Entities;

public class Guild
{
    public required string Id { get; set; }
    public required string CreatorId { get; set; }
    public AppUser? Creator { get; set; }
    public required string Name { get; set; }
    public required string DefaultGuildMemberRoleId { get; set; }
    public bool Archived { get; set; } = false;
    public List<GuildMembership> Memberships { get; set; } = new();
    public List<GuildApplication> Applications { get; set; } = new();
    public List<GuildBlacklist> Blacklist { get; set; } = new();
    public List<GuildRole> Roles { get; set; } = new();
    public List<Event> Events { get; set; } = new();
    public List<Tile> CustomTiles { get; set; } = new();
    public List<EventParticipant> Participants { get; set; } = new();
}