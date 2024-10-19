namespace API.Data.DTOs;

public class TileSubmissionDto
{
    public required string Id { get; set; }
    
    public required string AppUserId { get; set; }
    public string? UserName { get; set; }
    public string? Gamertag { get; set; }
    
    public DateTime SubmittedAt { get; set; }
    public DateTime EvidenceSubmittedAt { get; set; }
    
    public string? JudgeId { get; set; }
    public bool Accepted { get; set; }
    public string? Notes { get; set; }
}