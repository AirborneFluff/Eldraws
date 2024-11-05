namespace API.Entities;

public class EventParticipant : DeletableEntity
{
    public required string Id { get; set; }
    public required string Gamertag { get; set; }
}