namespace API.Entities;

public class GuildRole
{
    public required string Id { get; set; }
    public required string GuildId { get; set; }
    public Guild? Guild { get; set; }

    public required string Name { get; set; }
}