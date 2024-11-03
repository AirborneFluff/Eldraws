namespace API.Entities;

public class BingoEvent
{
    public required string Id { get; set; }
    
    public required string EventId { get; set; }    
    public Event? Event { get; set; }

    public int ColumnCount { get; set; } = 5;
    public int RowCount { get; set; } = 5;

    public IList<BingoBoardTile> BoardTiles { get; set; } = new List<BingoBoardTile>();
}