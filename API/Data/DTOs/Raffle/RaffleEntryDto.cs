namespace API.Data.DTOs.Raffle;

public class RaffleEntryDto
{
    public EventParticipantDto? Participant { get; set; }

    public required string Id { get; set; }
    public int Donation { get; set; }
    public int LowTicket { get; set; }
    public int HighTicket { get; set; }
    public bool Complimentary { get; set; }
}