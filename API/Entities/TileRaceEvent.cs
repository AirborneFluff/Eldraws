namespace API.Entities;

public class TileRaceEvent
{
    public required string Id { get; set; }
    
    public required string EventId { get; set; }
    public Event? Event { get; set; }
}