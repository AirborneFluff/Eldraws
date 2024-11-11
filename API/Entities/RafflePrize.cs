namespace API.Entities;

public class RafflePrize : DeletableEntity
{
    public required string Id { get; set; }

    public required string RaffleEventId { get; set; }
    public RaffleEvent? RaffleEvent { get; set; }

    public string? WinnerId { get; set; }
    public EventParticipant? Winner { get; set; }

    public int Position { get; set; }
    public float DonationPercentage { get; set; }
    public string? Description { get; set; }
    public int? WinningTicketNumber { get; set; }
}