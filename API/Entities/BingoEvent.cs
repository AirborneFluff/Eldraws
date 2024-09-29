namespace API.Entities;

public class BingoEvent
{
    public required string Id { get; set; }
    
    public required string EventId { get; set; }    
    public Event? Event { get; set; }

    public IList<BingoBoardTile> BoardTiles { get; set; } = new List<BingoBoardTile>();
}