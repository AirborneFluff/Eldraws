namespace API.Entities;

public class RaffleEntry : DeletableEntity
{
    public required string Id { get; set; }

    public required string RaffleEventId { get; set; }
    public RaffleEvent? RaffleEvent { get; set; }

    public required string ParticipantId { get; set; }
    public EventParticipant? Participant { get; set; }

    public int Donation { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    public int LowTicket { get; set; }
    public int HighTicket { get; set; }

    public bool Complimentary { get; set; }
}