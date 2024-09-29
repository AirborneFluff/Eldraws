using API.Entities;

namespace API.Data.DTOs;

public class UpdateBingoTileDto
{
    public required Position TilePosition { get; set; }
    public required string TileId { get; set; }
}