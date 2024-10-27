namespace API.Data.DTOs;

public class GuildDto
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string CreatorId { get; set; }

    public List<GuildMemberDto> Members { get; set; } = new();
}