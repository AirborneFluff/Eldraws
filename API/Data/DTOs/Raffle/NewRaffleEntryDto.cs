using System.ComponentModel.DataAnnotations;

namespace API.Data.DTOs.Raffle;

public class NewRaffleEntryDto
{
    [Required]
    public required string ParticipantId { get; set; }
    [Required]
    [Range(0, int.MaxValue)]
    public int Donation { get; set; }

    public bool Complimentary { get; set; } = false;
}