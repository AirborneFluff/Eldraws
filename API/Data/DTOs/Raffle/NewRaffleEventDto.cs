namespace API.Data.DTOs.Raffle;

public class NewRaffleEventDto : NewEventDto
{
    public DateTime? PrizeDrawDate { get; set; }
    public int EntryCost { get; set; }
}