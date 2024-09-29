using API.Entities;

namespace API.Data.DTOs;

public class BingoBoardTileDto
{
    public required string Id { get; set; }
    public required TileDto Tile { get; set; }
    public required Position Position { get; set; }
}