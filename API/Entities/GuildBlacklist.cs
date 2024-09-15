namespace API.Entities;

public class GuildBlacklist
{
    public required string GuildId { get; set; }
    public Guild? Guild { get; set; }

    public required string UserName { get; set; }
}