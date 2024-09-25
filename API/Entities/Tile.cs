namespace API.Entities;

public class Tile
{
    public required string Id { get; set; }

    public string? GuildId { get; set; }
    public Guild? Guild { get; set; }

    public required string Task { get; set; }
    public required string Description { get; set; }
    public required string Conditions { get; set; }
    public required string ImagePath { get; set; }
}