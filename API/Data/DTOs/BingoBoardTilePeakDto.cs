using API.Entities;

namespace API.Data.DTOs;

public class BingoBoardTilePeakDto
{
    public required string Id { get; set; }
    public required TilePeakDto Tile { get; set; }
    public required Position Position { get; set; }
}