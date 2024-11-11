namespace API.Entities;

public class EventParticipant : DeletableEntity
{
    public required string Id { get; set; }

    public required string GuildId { get; set; }
    public Guild? Guild { get; set; }
    
    public required string Gamertag { get; set; }
    public int TotalDonations { get; set; }
}