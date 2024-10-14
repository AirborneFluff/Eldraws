namespace API.Data.DTOs;

public class TileDto
{
    public required string Id { get; set; }

    public string? GuildId { get; set; }

    public required string Task { get; set; }
    public required string Description { get; set; }
    public string? Conditions { get; set; }
    public required string ImagePath { get; set; }
}