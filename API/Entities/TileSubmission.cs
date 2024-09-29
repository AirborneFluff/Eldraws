namespace API.Entities;

public class TileSubmission
{
    public required string Id { get; set; }
    
    public required string AppUserId { get; set; }
    public AppUser? AppUser { get; set; }

    public required string EventId { get; set; }
    public Event? Event { get; set; }
    
    public DateTime SubmissionDate { get; set; }
}