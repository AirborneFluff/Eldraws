namespace API.Entities;

public class GuildApplication
{
    public required string Id { get; set; }
    public required string GuildId { get; set; }
    public Guild? Guild { get; set; }

    public required string AppUserId { get; set; }
    public AppUser? AppUser { get; set; }
    
    public string? ReviewerId { get; set; }
    public AppUser? Reviewer { get; set; }

    public DateTime ApplicationDate { get; set; } = DateTime.UtcNow;

    public bool? Accepted { get; set; }
    public DateTime? ReviewDate { get; set; } = null;
}