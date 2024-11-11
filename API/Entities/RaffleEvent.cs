namespace API.Entities;

public class RaffleEvent : DeletableEntity
{
    public required string Id { get; set; }
    
    public required string EventId { get; set; }    
    public Event? Event { get; set; }
    
    public DateTime? PrizeDrawDate { get; set; }
    public int EntryCost { get; set; }

    public int TotalTickets { get; set; }
    public int TotalDonations { get; set; }

    public List<RaffleEntry> Entries { get; set; } = [];
    public List<RafflePrize> Prizes { get; set; } = [];
}