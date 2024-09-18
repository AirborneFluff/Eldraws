using static API.Entities.Event;

namespace API.Data.DTOs;

public class NewEventDto
{
    public required string Title { get; set; }
    public string? Subtitle { get; set; }
    public string? Description { get; set; }

    public required string GuildId { get; set; }
    
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public DateTime? EntryOpenDate { get; set; }
    public DateTime? EntryCloseDate { get; set; }

    public required EventType Type { get; set; }
}