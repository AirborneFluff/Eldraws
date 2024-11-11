namespace API.Data.DTOs.Raffle;

public class RaffleEventDto
{
    public DateTime? PrizeDrawDate { get; set; }
    public int EntryCost { get; set; }

    public int TotalTickets { get; set; }
    public int TotalDonations { get; set; }
}