namespace API.Entities;

public class Event
{
    public required string Id { get; set; }
    public required string Title { get; set; }
    public string? Subtitle { get; set; }
    public string? Description { get; set; }

    public required string GuildId { get; set; }
    public Guild? Guild { get; set; }

    public required string HostId { get; set; }
    public AppUser? Host { get; set; }

    public bool Started { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public DateTime? EntryOpenDate { get; set; }
    public DateTime? EntryCloseDate { get; set; }

    public required EventType Type { get; set; }
    
    public enum EventType
    {
        TileRace,
        Bingo
    }
}