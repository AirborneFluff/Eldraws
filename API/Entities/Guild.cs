namespace API.Entities;

public class Guild
{
    public required string Id { get; set; }
    
    public required string OwnerId { get; set; }
    public AppUser? Owner { get; set; }

    public required string Name { get; set; }

    public IList<GuildMembership> Memberships { get; set; } = new List<GuildMembership>();
}