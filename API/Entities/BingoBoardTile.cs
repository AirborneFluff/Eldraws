namespace API.Entities;

public class BingoBoardTile
{
    public required string Id { get; set; }

    public required string BingoEventId { get; set; }
    public BingoEvent? BingoEvent { get; set; }  

    public required string TileId { get; set; }
    public Tile? Tile { get; set; }

    public required Position Position { get; set; }

    public IList<TileSubmission> Submissions { get; set; } = new List<TileSubmission>();
}

public class Position
{
    public required int Row { get; set; }
    public required int Column { get; set; }
}