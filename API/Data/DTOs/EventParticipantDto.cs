namespace API.Data.DTOs;

public class EventParticipantDto
{
    public required string Id { get; set; }
    public required string GuildId { get; set; }
    public required string Gamertag { get; set; }
    public int TotalDonations { get; set; }
}