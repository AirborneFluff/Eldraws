using System.ComponentModel.DataAnnotations;

namespace API.Data.DTOs.Raffle;

public class NewRafflePrizeDto
{
    [Required]
    [Range(1, Int32.MaxValue)]
    public int Position { get; set; }
    
    public string? Description { get; set; }
    [Range(0f, 1f)]
    public float DonationPercentage { get; set; }
}