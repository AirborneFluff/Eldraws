namespace API.Data.DTOs;

public class TileUpdateDto
{
    public required string Task { get; set; }
    public required string Description { get; set; }
    public string? Conditions { get; set; }
    public required string ImagePath { get; set; }
}