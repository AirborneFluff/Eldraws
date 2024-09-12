namespace API.Entities;

public class GuildMembership
{
    public required string GuildId { get; set; }
    public Guild? Guild { get; set; }
    
    public required string AppUserId { get; set; }
    public AppUser? AppUser { get; set; }

    public DateTime AcceptanceDate { get; set; } = DateTime.UtcNow;
}