namespace API.Entities;

public class TileSubmission
{
    public required string Id { get; set; }
    
    public required string AppUserId { get; set; }
    public AppUser? AppUser { get; set; }

    public required string BingoBoardTileId { get; set; }
    public BingoBoardTile? BingoBoardTile { get; set; }

    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    public string? EvidenceUrl { get; set; }
        
    public string? JudgeId { get; set; }
    public AppUser? Judge { get; set; }

    public bool Accepted { get; set; }
    public string? Notes { get; set; }
}